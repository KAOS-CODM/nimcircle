const {
  verifyContributionTransaction,
} = require('./nimiqVerification')

const Contribution =
  require('../models/Contribution')

const Circle =
  require('../models/Circle')

const User =
  require('../models/User')

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeWallet(
  walletAddress,
) {
  return String(walletAddress || '')
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase()
}

function normalizeTransactionHash(
  transactionHash,
) {
  return String(
    transactionHash || '',
  ).trim()
}

function normalizeMemo(memo) {
  return typeof memo === 'string'
    ? memo.trim()
    : ''
}

async function getCreatorContributionTotal(
  circleId,
  creatorWallet,
) {
  const normalizedWallet =
    normalizeWallet(
      creatorWallet,
    )

  const result =
    await Contribution.aggregate([
      {
        $match: {
          circleId,

          contributorWallet:
            normalizedWallet,

          /*
           * Commitment contributions consume
           * creator commitment capacity.
           *
           * Existing contributions created before
           * contributionType was introduced do not
           * have this field, so they are treated as
           * legacy commitment contributions.
           */
          $or: [
            {
              contributionType:
                'commitment',
            },
            {
              contributionType: {
                $exists: false,
              },
            },
          ],

          /*
           * Pending contributions reserve
           * creator commitment capacity.
           *
           * Failed contributions do not.
           */
          status: {
            $in: [
              'pending',
              'confirmed',
            ],
          },
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: '$amount',
          },
        },
      },
    ])

  return result[0]?.total || 0
}

/* -------------------------------------------------------------------------- */
/* Create contribution                                                        */
/* -------------------------------------------------------------------------- */

async function createContribution({
  circleId,
  contributorWallet,
  contributorUserId,
  amount,
  transactionHash,
  recipientWallet,
  memo,
  contributionType,
}) {
  if (
    !circleId ||
    !contributorWallet ||
    !contributorUserId ||
    !amount ||
    !transactionHash ||
    !recipientWallet
  ) {
    const error = new Error(
      'circleId, contributorWallet, contributorUserId, amount, transactionHash and recipientWallet are required',
    )

    error.statusCode = 400
    throw error
  }

  const normalizedCircleId =
    String(circleId).trim()

  const normalizedWallet =
    normalizeWallet(
      contributorWallet,
    )

  const normalizedRecipientWallet =
    normalizeWallet(
      recipientWallet,
    )

  const normalizedHash =
    normalizeTransactionHash(
      transactionHash,
    )

  const normalizedMemo =
    normalizeMemo(memo)

  const parsedAmount =
    Number(amount)

  if (!normalizedHash) {
    const error = new Error(
      'transactionHash is required',
    )

    error.statusCode = 400
    throw error
  }

  /* ---------------------------------------------------------------------- */
  /* Idempotency                                                             */
  /* ---------------------------------------------------------------------- */

  const existingContribution =
    await Contribution.findOne({
      transactionHash:
        normalizedHash,
    })

  if (existingContribution) {
    const sameCircle =
      existingContribution.circleId ===
      normalizedCircleId

    const sameWallet =
      existingContribution
        .contributorWallet ===
      normalizedWallet

    const sameRecipient =
      existingContribution
        .recipientWallet ===
      normalizedRecipientWallet

    const sameAmount =
      existingContribution.amount ===
      parsedAmount

    const sameMemo =
      existingContribution.memo ===
      normalizedMemo

    const sameUser =
      String(
        existingContribution
          .contributorUserId,
      ) ===
      String(contributorUserId)

    if (
      !sameCircle ||
      !sameWallet ||
      !sameRecipient ||
      !sameAmount ||
      !sameMemo ||
      !sameUser
    ) {
      const error = new Error(
        'This transaction hash is already associated with different contribution data',
      )

      error.statusCode = 409
      throw error
    }

    return existingContribution
  }

  /* ---------------------------------------------------------------------- */
  /* Validate Circle                                                         */
  /* ---------------------------------------------------------------------- */

  const circle =
    await Circle.findOne({
      circleId:
        normalizedCircleId,
    })

  if (!circle) {
    const error = new Error(
      'Circle not found',
    )

    error.statusCode = 404
    throw error
  }

  const isCreator =
    normalizedWallet ===
    normalizeWallet(
      circle.creatorWallet,
    )
  
  const isFundraisingCircle =
    normalizeWallet(
      circle.creatorWallet,
    ) !==
    normalizeWallet(
      circle.goalOwnerWallet,
    )
  
  const normalizedContributionType =
    contributionType === 'commitment'
      ? 'commitment'
      : 'normal'
  
  if (
    normalizedContributionType ===
      'commitment' &&
    (!isCreator ||
      !isFundraisingCircle)
  ) {
    const error = new Error(
      'Only the creator of a fundraising Circle can make a commitment contribution',
    )
  
    error.statusCode = 403
    throw error
  }

  /* ---------------------------------------------------------------------- */
  /* Synchronize Circle status                                               */
  /* ---------------------------------------------------------------------- */

  if (
    circle.status ===
    'active'
  ) {
    const contributionTotal =
      await Contribution.aggregate([
        {
          $match: {
            circleId:
              circle.circleId,

            status:
              'confirmed',
          },
        },
        {
          $group: {
            _id: null,

            total: {
              $sum: '$amount',
            },
          },
        },
      ])

    const raisedAmount =
      contributionTotal[0]
        ?.total || 0

    if (
      raisedAmount >=
      circle.targetAmount
    ) {
      circle.status =
        'completed'

      circle.completedAt =
        new Date()

      await circle.save()
    } else if (
      new Date() >
      circle.deadline
    ) {
      circle.status =
        'expired'

      await circle.save()
    }
  }

  if (
    circle.status !==
    'active'
  ) {
    const error = new Error(
      'This Circle is no longer accepting contributions',
    )

    error.statusCode = 400
    throw error
  }

  /* ---------------------------------------------------------------------- */
  /* Validate contributor                                                    */
  /* ---------------------------------------------------------------------- */

  const user =
    await User.findById(
      contributorUserId,
    )

  if (!user) {
    const error = new Error(
      'Contributor user not found',
    )

    error.statusCode = 404
    throw error
  }

  if (
    user.walletAddress !==
    normalizedWallet
  ) {
    const error = new Error(
      'Contributor wallet does not match the user',
    )

    error.statusCode = 403
    throw error
  }

  /* ---------------------------------------------------------------------- */
  /* Validate recipient                                                      */
  /* ---------------------------------------------------------------------- */

  /*
   * Every contribution must go to the
   * Circle goal owner's wallet.
   */
  if (
    normalizedRecipientWallet !==
    circle.goalOwnerWallet
  ) {
    const error = new Error(
      'Contribution recipient does not match the Circle goal owner',
    )

    error.statusCode = 400
    throw error
  }

  /*
   * The goal owner cannot contribute to
   * their own Circle.
   */
  if (
    normalizedWallet ===
    circle.goalOwnerWallet
  ) {
    const error = new Error(
      'The goal owner cannot record a self-payment as a contribution',
    )

    error.statusCode = 400
    throw error
  }

  /* ---------------------------------------------------------------------- */
  /* Validate amount                                                         */
  /* ---------------------------------------------------------------------- */

  if (
    !Number.isSafeInteger(
      parsedAmount,
    ) ||
    parsedAmount < 1
  ) {
    const error = new Error(
      'amount must be a positive integer amount in Luna',
    )

    error.statusCode = 400
    throw error
  }

  /* ---------------------------------------------------------------------- */
  /* Check remaining Circle target                                           */
  /* ---------------------------------------------------------------------- */

  const contributionTotal =
    await Contribution.aggregate([
      {
        $match: {
          circleId:
            circle.circleId,

          status:
            'confirmed',
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: '$amount',
          },
        },
      },
    ])

  const raisedAmount =
    contributionTotal[0]
      ?.total || 0

  const remainingAmount =
    Math.max(
      circle.targetAmount -
        raisedAmount,
      0,
    )

  /*
   * This remains a hard safety limit.
   *
   * Even if a creator has already reached
   * their commitment, a contribution cannot
   * exceed the remaining Circle target.
   */
  if (
    parsedAmount >
    remainingAmount
  ) {
    const error = new Error(
      `Contribution exceeds the remaining Circle target. Maximum contribution is ${remainingAmount} Luna`,
    )

    error.statusCode = 400
    throw error
  }

  /* ---------------------------------------------------------------------- */
  /* Creator commitment                                                      */
  /* ---------------------------------------------------------------------- */

  /*
   * Creator commitment is intentionally NOT
   * used as a hard payment limit here.
   *
   * A creator may contribute more than their
   * original commitment.
   *
   * The commitment represents how much the
   * creator committed to contribute, not the
   * maximum amount their wallet is allowed
   * to send to the Circle.
   *
   * The frontend warns the creator when a
   * payment would exceed the commitment and
   * lets them choose whether to increase the
   * commitment or make a normal contribution.
   *
   * Most importantly, once a blockchain
   * transaction exists, this endpoint will
   * not reject it simply because the creator
   * commitment has been fulfilled.
   */

  /* ---------------------------------------------------------------------- */
  /* Create pending contribution                                             */
  /* ---------------------------------------------------------------------- */

  try {
    const contribution =
      await Contribution.create({
        circleId:
          circle.circleId,
    
        contributorWallet:
          normalizedWallet,
    
        contributorUserId,
    
        recipientWallet:
          normalizedRecipientWallet,
    
        amount:
          parsedAmount,
    
        contributionType:
          normalizedContributionType,
    
        transactionHash:
          normalizedHash,
    
        memo:
          normalizedMemo,
    
        status:
          'pending',
      })

    return contribution
  } catch (error) {
    /*
     * A concurrent request may have inserted
     * the same transaction between our initial
     * lookup and Contribution.create().
     */
    if (
      error.code === 11000
    ) {
      const duplicateContribution =
        await Contribution.findOne({
          transactionHash:
            normalizedHash,
        })

      if (
        duplicateContribution
      ) {
        return duplicateContribution
      }

      const duplicateError =
        new Error(
          'This transaction has already been recorded',
        )

      duplicateError.statusCode =
        409

      throw duplicateError
    }

    throw error
  }
}

/* -------------------------------------------------------------------------- */
/* Confirm contribution                                                       */
/* -------------------------------------------------------------------------- */

async function confirmContribution(
  transactionHash,
) {
  const normalizedHash =
    normalizeTransactionHash(
      transactionHash,
    )

  if (!normalizedHash) {
    const error = new Error(
      'Transaction hash is required',
    )

    error.statusCode = 400
    throw error
  }

  const contribution =
    await Contribution.findOne({
      transactionHash:
        normalizedHash,
    })

  if (!contribution) {
    const error = new Error(
      'Contribution not found',
    )

    error.statusCode = 404
    throw error
  }

  /*
   * Idempotent confirmation.
   */
  if (
    contribution.status ===
    'confirmed'
  ) {
    return contribution
  }

  /*
   * A permanently failed contribution
   * should not be confirmed again.
   */
  if (
    contribution.status ===
    'failed'
  ) {
    const error = new Error(
      'Contribution has already failed',
    )

    error.statusCode = 400
    throw error
  }

  const circle =
    await Circle.findOne({
      circleId:
        contribution.circleId,
    })

  if (!circle) {
    const error = new Error(
      'Circle not found',
    )

    error.statusCode = 404
    throw error
  }

  /*
   * The transaction itself determines
   * whether this pending contribution is valid.
   */
  if (
    contribution.recipientWallet !==
    circle.goalOwnerWallet
  ) {
    const error = new Error(
      'Contribution recipient does not match the Circle goal owner',
    )

    error.statusCode = 400
    throw error
  }

  /* ---------------------------------------------------------------------- */
  /* Verify transaction against blockchain                                   */
  /* ---------------------------------------------------------------------- */

  const verification =
    await verifyContributionTransaction({
      transactionHash:
        contribution.transactionHash,

      contributorWallet:
        contribution.contributorWallet,

      recipientWallet:
        circle.goalOwnerWallet,

      amount:
        contribution.amount,

      memo:
        contribution.memo,
    })

  if (
    !verification.valid
  ) {
    const reason =
      verification.reason ||
      'Nimiq transaction verification failed'

    const error =
      new Error(reason)

    error.code =
      verification.code

    error.retryable =
      verification.retryable === true

    if (
      verification.retryable
    ) {
      error.statusCode = 409
    } else {
      error.statusCode =
        400
    }

    throw error
  }

  /* ---------------------------------------------------------------------- */
  /* Mark contribution confirmed                                             */
  /* ---------------------------------------------------------------------- */

  contribution.status =
    'confirmed'

  contribution.confirmedAt =
    new Date()

  await contribution.save()

  /* ---------------------------------------------------------------------- */
  /* Synchronize Circle completion                                           */
  /* ---------------------------------------------------------------------- */

  if (
    circle.status ===
    'active'
  ) {
    const contributionTotal =
      await Contribution.aggregate([
        {
          $match: {
            circleId:
              circle.circleId,

            status:
              'confirmed',
          },
        },
        {
          $group: {
            _id: null,

            total: {
              $sum: '$amount',
            },
          },
        },
      ])

    const raisedAmount =
      contributionTotal[0]
        ?.total || 0

    if (
      raisedAmount >=
      circle.targetAmount
    ) {
      circle.status =
        'completed'

      circle.completedAt =
        new Date()

      await circle.save()
    }
  }

  return contribution
}

/* -------------------------------------------------------------------------- */
/* Get user contributions                                                     */
/* -------------------------------------------------------------------------- */

async function getUserContributions(
  walletAddress,
) {
  const normalizedWallet =
    normalizeWallet(
      walletAddress,
    )

  return Contribution.find({
    contributorWallet:
      normalizedWallet,

    status:
      'confirmed',
  })
    .sort({
      createdAt: -1,
    })
    .lean()
}

/* -------------------------------------------------------------------------- */
/* Get Circle contributions                                                   */
/* -------------------------------------------------------------------------- */

async function getCircleContributions(
  circleId,
) {
  return Contribution.find({
    circleId,

    status:
      'confirmed',
  })
    .populate(
      'contributorUserId',
      'username displayName avatar walletAddress',
    )
    .sort({
      createdAt: -1,
    })
    .lean()
}

/* -------------------------------------------------------------------------- */
/* Exports                                                                    */
/* -------------------------------------------------------------------------- */

module.exports = {
  createContribution,
  confirmContribution,
  getUserContributions,
  getCircleContributions,
}