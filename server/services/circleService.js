const Circle = require('../models/Circle')
const Contribution = require('../models/Contribution')
const User = require('../models/User')

async function createCircle({
  name,
  description,
  targetAmount,
  deadline,
  creatorWallet,
  creatorUserId,
  goalOwnerWallet,
  goalOwnerUserId,
  creatorCommitment,
}) {
  if (
    !name ||
    targetAmount === undefined ||
    targetAmount === null ||
    !deadline ||
    !creatorWallet ||
    !creatorUserId ||
    !goalOwnerWallet ||
    creatorCommitment === undefined ||
    creatorCommitment === null
  ) {
    const error = new Error(
      'name, targetAmount, deadline, creatorWallet, creatorUserId, goalOwnerWallet and creatorCommitment are required',
    )

    error.statusCode = 400
    throw error
  }

  const normalizedCreatorWallet =
    creatorWallet
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase()

  const normalizedGoalOwnerWallet =
    goalOwnerWallet
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase()

  const creator =
    await User.findById(
      creatorUserId,
    )

  if (!creator) {
    const error = new Error(
      'Creator user not found',
    )

    error.statusCode = 404
    throw error
  }

  if (
    creator.walletAddress !==
    normalizedCreatorWallet
  ) {
    const error = new Error(
      'Creator wallet does not match the user',
    )

    error.statusCode = 403
    throw error
  }

  /*
   * The goal owner can be the creator,
   * so goalOwnerUserId is optional.
   *
   * If a user ID is supplied, however,
   * it must belong to the supplied wallet.
   */
  let goalOwnerUserIdValue = null

  if (goalOwnerUserId) {
    const goalOwner =
      await User.findById(
        goalOwnerUserId,
      )

    if (!goalOwner) {
      const error = new Error(
        'Goal owner user not found',
      )

      error.statusCode = 404
      throw error
    }

    if (
      goalOwner.walletAddress !==
      normalizedGoalOwnerWallet
    ) {
      const error = new Error(
        'Goal owner wallet does not match the user',
      )

      error.statusCode = 403
      throw error
    }

    goalOwnerUserIdValue =
      goalOwner._id
  } else if (
    normalizedGoalOwnerWallet ===
    normalizedCreatorWallet
  ) {
    /*
     * For a personal goal, the creator is
     * also the goal owner.
     */
    goalOwnerUserIdValue =
      creator._id
  }

  const parsedTargetAmount =
    Number(targetAmount)

  if (
    !Number.isSafeInteger(
      parsedTargetAmount,
    ) ||
    parsedTargetAmount < 1
  ) {
    const error = new Error(
      'targetAmount must be a positive integer amount in Luna',
    )

    error.statusCode = 400
    throw error
  }

  const parsedCreatorCommitment =
    Number(creatorCommitment)

  if (
    !Number.isSafeInteger(
      parsedCreatorCommitment,
    ) ||
    parsedCreatorCommitment < 0
  ) {
    const error = new Error(
      'creatorCommitment must be a non-negative integer amount in Luna',
    )

    error.statusCode = 400
    throw error
  }

  /*
   * A creator cannot commit more than
   * the Circle target.
   */
  if (
    parsedCreatorCommitment >
    parsedTargetAmount
  ) {
    const error = new Error(
      'creatorCommitment cannot exceed the Circle target',
    )

    error.statusCode = 400
    throw error
  }

  const parsedDeadline =
    new Date(deadline)

  if (
    Number.isNaN(
      parsedDeadline.getTime(),
    )
  ) {
    const error = new Error(
      'Invalid deadline',
    )

    error.statusCode = 400
    throw error
  }

  if (
    parsedDeadline.getTime() <=
    Date.now()
  ) {
    const error = new Error(
      'Deadline must be in the future',
    )

    error.statusCode = 400
    throw error
  }

  const circleId =
    `circle_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`

  try {
    return await Circle.create({
      circleId,

      name:
        name.trim(),

      description:
        description?.trim() || '',

      targetAmount:
        parsedTargetAmount,

      deadline:
        parsedDeadline,

      creatorWallet:
        normalizedCreatorWallet,

      creatorUserId,

      goalOwnerWallet:
        normalizedGoalOwnerWallet,

      goalOwnerUserId:
        goalOwnerUserIdValue,

      creatorCommitment:
        parsedCreatorCommitment,
    })
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError =
        new Error(
          'A Circle with this ID already exists',
        )

      duplicateError.statusCode = 409

      throw duplicateError
    }

    throw error
  }
}

async function syncCircleStatus(
  circle,
) {
  if (
    circle.status ===
      'completed' ||
    circle.status ===
      'cancelled'
  ) {
    return circle
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
    contributionTotal[0]?.total || 0

  let newStatus =
    circle.status

  if (
    raisedAmount >=
    circle.targetAmount
  ) {
    newStatus = 'completed'
  } else if (
    new Date() >
    circle.deadline
  ) {
    newStatus = 'expired'
  }

  if (
    newStatus !==
    circle.status
  ) {
    circle.status =
      newStatus

    if (
      newStatus ===
      'completed'
    ) {
      circle.completedAt =
        new Date()
    }

    await circle.save()
  }

  return circle
}

async function getCircleById(
  circleId,
) {
  let circle =
    await Circle.findOne({
      circleId,
    })
      .populate(
        'creatorUserId',
        'username displayName avatar walletAddress',
      )
      .populate(
        'goalOwnerUserId',
        'username displayName avatar walletAddress',
      )

  if (!circle) {
    const error = new Error(
      'Circle not found',
    )

    error.statusCode = 404
    throw error
  }

  circle =
    await syncCircleStatus(
      circle,
    )

  const contributions =
    await Contribution.find({
      circleId:
        circle.circleId,

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

  const raisedAmount =
    contributions.reduce(
      (
        total,
        contribution,
      ) =>
        total +
        contribution.amount,
      0,
    )

  const contributorWallets =
    new Set(
      contributions.map(
        (contribution) =>
          contribution
            .contributorWallet
            .toLowerCase(),
      ),
    )

  const targetAmount =
    circle.targetAmount

  const remainingAmount =
    Math.max(
      targetAmount -
        raisedAmount,
      0,
    )

  const progressPercentage =
    targetAmount > 0
      ? Math.min(
          (raisedAmount /
            targetAmount) *
            100,
          100,
        )
      : 0

  return {
    circle:
      circle.toObject(),

    /*stats: {
      raisedAmount,

      targetAmount,

      remainingAmount,

      progressPercentage,

      contributorCount:
        contributorWallets.size,

      creatorCommitment:
        circle.creatorCommitment,

      communityRaised:
        Math.max(
          raisedAmount -
            circle.creatorCommitment,
          0,
        ),
    },*/

    stats: {
      raisedAmount,
    
      targetAmount,
    
      remainingAmount,
    
      progressPercentage,
    
      contributorCount:
        contributorWallets.size,
    
      creatorCommitment:
        circle.creatorCommitment,
    },

    contributions,
  }
}

async function getCreatedCircles(
  walletAddress,
) {
  const normalizedWallet =
    walletAddress
      .trim()
      .toLowerCase()

  return Circle.find({
    creatorWallet:
      normalizedWallet,
  })
    .sort({
      createdAt: -1,
    })
    .lean()
}

async function getJoinedCircles(
  walletAddress,
) {
  const normalizedWallet =
    walletAddress
      .trim()
      .toLowerCase()

  const circleIds =
    await Contribution.find({
      contributorWallet:
        normalizedWallet,

      status: 'confirmed',
    }).distinct(
      'circleId',
    )

  return Circle.find({
    circleId: {
      $in: circleIds,
    },
  })
    .sort({
      createdAt: -1,
    })
    .lean()
}

async function updateCircleStatus(
  circleId,
  status,
  walletAddress,
) {
  if (!walletAddress) {
    const error = new Error(
      'walletAddress is required',
    )

    error.statusCode = 400
    throw error
  }

  if (
    status !==
    'cancelled'
  ) {
    const error = new Error(
      'The only manual status change allowed is cancellation',
    )

    error.statusCode = 400
    throw error
  }

  const circle =
    await Circle.findOne({
      circleId,
    })

  if (!circle) {
    const error = new Error(
      'Circle not found',
    )

    error.statusCode = 404
    throw error
  }

  const normalizedWallet =
    walletAddress
      .trim()
      .toLowerCase()

  if (
    circle.creatorWallet !==
    normalizedWallet
  ) {
    const error = new Error(
      'Only the Circle creator can cancel it',
    )

    error.statusCode = 403
    throw error
  }

  if (
    circle.status ===
      'completed' ||
    circle.status ===
      'cancelled'
  ) {
    const error = new Error(
      'This Circle can no longer change status',
    )

    error.statusCode = 400
    throw error
  }

  circle.status =
    'cancelled'

  circle.cancelledAt =
    new Date()

  await circle.save()

  return circle
}

async function extendCircleDeadline(
  circleId,
  deadline,
  walletAddress,
) {
  if (!walletAddress) {
    const error = new Error(
      'walletAddress is required',
    )

    error.statusCode = 400
    throw error
  }

  if (!deadline) {
    const error = new Error(
      'deadline is required',
    )

    error.statusCode = 400
    throw error
  }

  const circle =
    await Circle.findOne({
      circleId,
    })

  if (!circle) {
    const error = new Error(
      'Circle not found',
    )

    error.statusCode = 404
    throw error
  }

  const normalizedWallet =
    walletAddress
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase()

  if (
    circle.creatorWallet !==
    normalizedWallet
  ) {
    const error = new Error(
      'Only the Circle creator can extend the deadline',
    )

    error.statusCode = 403
    throw error
  }

  if (
    circle.status ===
      'completed' ||
    circle.status ===
      'cancelled' ||
    circle.status ===
      'expired'
  ) {
    const error = new Error(
      'This Circle can no longer extend its deadline',
    )

    error.statusCode = 400
    throw error
  }

  const parsedDeadline =
    new Date(deadline)

  if (
    Number.isNaN(
      parsedDeadline.getTime(),
    )
  ) {
    const error = new Error(
      'Invalid deadline',
    )

    error.statusCode = 400
    throw error
  }

  if (
    parsedDeadline.getTime() <=
    Date.now()
  ) {
    const error = new Error(
      'Deadline must be in the future',
    )

    error.statusCode = 400
    throw error
  }

  if (
    parsedDeadline.getTime() <=
    circle.deadline.getTime()
  ) {
    const error = new Error(
      'New deadline must be later than the current deadline',
    )

    error.statusCode = 400
    throw error
  }

  circle.deadline =
    parsedDeadline

  await circle.save()

  return circle
}

module.exports = {
  createCircle,
  syncCircleStatus,
  getCircleById,
  getCreatedCircles,
  getJoinedCircles,
  updateCircleStatus,
  extendCircleDeadline,
}