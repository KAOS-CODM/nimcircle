const Contribution = require('../models/Contribution')
const Circle = require('../models/Circle')
const User = require('../models/User')

async function createContribution({
  circleId,
  contributorWallet,
  contributorUserId,
  amount,
  transactionHash,
}) {
  if (
    !circleId ||
    !contributorWallet ||
    !contributorUserId ||
    !amount ||
    !transactionHash
  ) {
    const error = new Error(
      'circleId, contributorWallet, contributorUserId, amount and transactionHash are required',
    )

    error.statusCode = 400
    throw error
  }

  let circle =
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
   * Synchronize the Circle status before
   * accepting a new contribution.
   */
  if (
    circle.status === 'active'
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
    circle.status !== 'active'
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

  /*
   * Calculate the current confirmed
   * balance before accepting the contribution.
   */
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

  /*
   * Never allow a contribution to
   * exceed the Circle target.
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

  try {
    const contribution =
      await Contribution.create({
        circleId:
          circle.circleId,

        contributorWallet:
          normalizedWallet,

        contributorUserId,

        amount:
          parsedAmount,

        transactionHash:
          normalizedHash,

        status: 'pending',
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
    await Contribution.findOne(
      {
        transactionHash,
      },
    )

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
      'Failed contributions cannot be confirmed',
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

  if (
    circle.status !== 'active'
  ) {
    const error = new Error(
      'This Circle is no longer accepting contributions',
    )

    error.statusCode = 400
    throw error
  }

  if (
    new Date() >
    circle.deadline
  ) {
    circle.status =
      'expired'

    await circle.save()

    const error = new Error(
      'This Circle has passed its deadline',
    )

    error.statusCode = 400
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

  const newRaisedAmount =
    raisedAmount +
    contribution.amount

  if (
    newRaisedAmount >
    circle.targetAmount
  ) {
    const error = new Error(
      'Confirming this contribution would exceed the Circle target',
    )

    error.statusCode = 400
    throw error
  }

  contribution.status =
    'confirmed'

  contribution.confirmedAt =
    new Date()

  await contribution.save()

  if (
    newRaisedAmount >=
    circle.targetAmount
  ) {
    circle.status =
      'completed'

    circle.completedAt =
      new Date()

    await circle.save()
  }

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