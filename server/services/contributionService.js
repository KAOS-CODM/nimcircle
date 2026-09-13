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

  /*
   * transactionHash is the unique identity of
   * the blockchain payment.
   *
   * Check it before performing Circle-state
   * validation so a retry can safely recover
   * an already-created pending contribution.
   */
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

    /*
     * Never allow the same transaction hash
     * to be reused with different contribution
     * information.
     */
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

    /*
     * The request is a safe retry.
     *
     * Return the existing contribution rather
     * than creating a duplicate or returning
     * an unnecessary 409 error.
     */
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

  /* ---------------------------------------------------------------------- */
  /* Synchronize Circle status before accepting a new contribution           */
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
   * The goal owner cannot record a normal
   * contribution to their own personal goal.
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
     *
     * Recover that situation safely.
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
   *
   * If the transaction has already been
   * confirmed, return it immediately.
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
   * IMPORTANT:
   *
   * Do not require the Circle to still be
   * "active" here.
   *
   * A contribution may have been sent while
   * the Circle was active and become visible
   * on the blockchain after the Circle reached
   * its target or expired.
   *
   * The transaction itself is what determines
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

    /*
     * Verification now explicitly tells us
     * whether the problem is temporary.
     *
     * Temporary examples:
     * - transaction not visible yet
     * - transaction not confirmed yet
     * - temporary blockchain query failure
     *
     * Permanent examples:
     * - wrong sender
     * - wrong recipient
     * - wrong amount
     * - wrong memo
     * - failed transaction
     */
    error.code =
      verification.code

    error.retryable =
      verification.retryable === true

    if (
      verification.retryable
    ) {
      /*
       * 409 tells the frontend that the
       * contribution exists but cannot be
       * completed yet.
       */
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

  /*
   * The contribution has now been verified,
   * so it can contribute to the Circle's
   * confirmed total.
   *
   * We only synchronize completion after
   * the contribution itself is confirmed.
   */
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