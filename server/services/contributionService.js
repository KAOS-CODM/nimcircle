const {
  verifyContributionTransaction,
} = require('./nimiqVerification')
const Contribution = require('../models/Contribution')
const Circle = require('../models/Circle')
const User = require('../models/User')

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

  const circle =
    await Circle.findOne({
      circleId:
        circleId.trim(),
    })

  if (!circle) {
    const error = new Error(
      'Circle not found',
    )

    error.statusCode = 404
    throw error
  }

  /*
   * Synchronize Circle status before
   * accepting a new contribution.
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

            status: 'confirmed',
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
      contributionTotal[0]?.total ||
      0

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

  const normalizedWallet =
    contributorWallet
      .trim()
      .toLowerCase()

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

  const normalizedRecipientWallet =
    recipientWallet
      .trim()
      .toLowerCase()

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
   * A personal goal cannot be funded by
   * pretending the creator paid themselves.
   *
   * The creator commitment for a personal
   * goal is handled separately.
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

  const parsedAmount =
    Number(amount)

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

  const normalizedHash =
    transactionHash.trim()

  if (!normalizedHash) {
    const error = new Error(
      'transactionHash is required',
    )

    error.statusCode = 400
    throw error
  }

  const normalizedMemo =
    typeof memo === 'string'
      ? memo.trim()
      : ''

  const existingContribution =
    await Contribution.findOne({
      transactionHash:
        normalizedHash,
    })

  if (existingContribution) {
    const error = new Error(
      'This transaction has already been recorded',
    )

    error.statusCode = 409

    error.contribution =
      existingContribution

    throw error
  }

  const contributionTotal =
    await Contribution.aggregate([
      {
        $match: {
          circleId:
            circle.circleId,

          status: 'confirmed',
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
    contributionTotal[0]?.total ||
    0

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
    if (error.code === 11000) {
      const duplicateError =
        new Error(
          'This transaction has already been recorded',
        )

      duplicateError.statusCode = 409

      throw duplicateError
    }

    throw error
  }
}

async function confirmContribution(
  transactionHash,
) {
  const contribution =
    await Contribution.findOne({
      transactionHash,
    })

  if (!contribution) {
    const error = new Error(
      'Contribution not found',
    )

    error.statusCode = 404
    throw error
  }

  if (
    contribution.status ===
    'confirmed'
  ) {
    return contribution
  }

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

  if (circle.status !== 'active') {
    const error = new Error(
      `Circle is ${circle.status}`,
    )

    error.statusCode = 400
    throw error
  }

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

  if (!verification.valid) {
    const reason =
      verification.reason ||
      'Nimiq transaction verification failed'

    const error =
      new Error(reason)

    /*
     * A transaction may already be broadcast
     * but not yet appear in the recipient's
     * blockchain history. This is temporary and
     * should be retried rather than treated as
     * a permanently invalid contribution.
     */
    const transactionNotFound =
      reason
        .toLowerCase()
        .includes('transaction was not found')

    if (transactionNotFound) {
      error.statusCode = 409
      error.code =
        'TRANSACTION_NOT_FOUND'
      error.retryable = true
    } else {
      /*
       * The transaction was found, but failed
       * one of the actual contribution checks.
       */
      error.statusCode = 400
      error.retryable = false
    }

    throw error
  }

  contribution.status =
    'confirmed'

  contribution.confirmedAt =
    new Date()

  await contribution.save()

  return contribution
}

async function getUserContributions(
  walletAddress,
) {
  const normalizedWallet =
    walletAddress
      .trim()
      .toLowerCase()

  return Contribution.find({
    contributorWallet:
      normalizedWallet,

    status: 'confirmed',
  })
    .sort({
      createdAt: -1,
    })
    .lean()
}

async function getCircleContributions(
  circleId,
) {
  return Contribution.find({
    circleId,

    status: 'confirmed',
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

module.exports = {
  createContribution,
  confirmContribution,
  getUserContributions,
  getCircleContributions,
}