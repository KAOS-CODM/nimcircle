const Circle = require('../models/Circle')
const Contribution = require('../models/Contribution')
const User = require('../models/User')

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

async function getCreatorContributionTotal(
  circleId,
  creatorWallet,
) {
  const normalizedWallet =
    normalizeWallet(creatorWallet)

  const result =
    await Contribution.aggregate([
      {
        $match: {
          circleId,
          contributorWallet:
            normalizedWallet,
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
/* Create Circle                                                              */
/* -------------------------------------------------------------------------- */

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
    normalizeWallet(
      creatorWallet,
    )

  const normalizedGoalOwnerWallet =
    normalizeWallet(
      goalOwnerWallet,
    )

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
   * A personal Circle has the same creator
   * and goal owner.
   *
   * A fundraising Circle has a different
   * creator and goal owner.
   */
  const isPersonalGoal =
    normalizedCreatorWallet ===
    normalizedGoalOwnerWallet

  /*
   * Resolve and validate the goal owner.
   *
   * For personal Circles, the creator is
   * automatically the goal owner.
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
    isPersonalGoal
  ) {
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
   * Personal Circles do not have a creator
   * commitment because the goal owner cannot
   * contribute to their own Circle.
   */
  if (
    isPersonalGoal &&
    parsedCreatorCommitment !== 0
  ) {
    const error = new Error(
      'Personal Circles must have a creator commitment of 0',
    )

    error.statusCode = 400
    throw error
  }

  /*
   * Fundraising Circles require the creator
   * to make a positive total commitment.
   */
  if (
    !isPersonalGoal &&
    parsedCreatorCommitment < 1
  ) {
    const error = new Error(
      'Fundraising Circles require a positive creator commitment',
    )

    error.statusCode = 400
    throw error
  }

  /*
   * The creator cannot commit more than
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
    if (
      error.code === 11000
    ) {
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

/* -------------------------------------------------------------------------- */
/* Synchronize Circle status                                                  */
/* -------------------------------------------------------------------------- */

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
    contributionTotal[0]?.total ||
    0

  let newStatus =
    circle.status

  if (
    raisedAmount >=
    circle.targetAmount
  ) {
    newStatus =
      'completed'
  } else if (
    new Date() >
    circle.deadline
  ) {
    newStatus =
      'expired'
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

/* -------------------------------------------------------------------------- */
/* Get Circle                                                                 */
/* -------------------------------------------------------------------------- */

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

  const rawContributions =
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

  /*
   * Convert the populated contributor user
   * into the flat API shape expected by the
   * frontend.
   *
   * This prevents the frontend from making
   * another /users/:walletAddress request
   * for every contribution.
   */
  const contributions =
    rawContributions.map(
      (contribution) => ({
        ...contribution,

        contributorUsername:
          contribution
            .contributorUserId
            ?.username ||
          contribution
            .contributorUserId
            ?.displayName ||
          contribution
            .contributorWallet,

        contributorUserId:
          contribution
            .contributorUserId
            ?._id ??
          contribution.contributorUserId,

        contributorWallet:
          normalizeWallet(
            contribution
              .contributorWallet,
          ),

        recipientWallet:
          normalizeWallet(
            contribution
              .recipientWallet,
          ),
      }),
    )

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

  const creatorContributedAmount =
    await getCreatorContributionTotal(
      circle.circleId,
      circle.creatorWallet,
    )

  const creatorCommitment =
    circle.creatorCommitment

  const creatorCommitmentRemaining =
    Math.max(
      creatorCommitment -
        creatorContributedAmount,
      0,
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

    stats: {
      raisedAmount,

      targetAmount,

      remainingAmount,

      progressPercentage,

      contributorCount:
        contributorWallets.size,

      creatorCommitment,

      creatorContributedAmount,

      creatorCommitmentRemaining,
    },

    contributions,
  }
}

/* -------------------------------------------------------------------------- */
/* Get Created Circles                                                        */
/* -------------------------------------------------------------------------- */

async function getCreatedCircles(
  walletAddress,
) {
  const normalizedWallet =
    normalizeWallet(
      walletAddress,
    )

  return Circle.find({
    creatorWallet:
      normalizedWallet,
  })
    .sort({
      createdAt: -1,
    })
    .lean()
}

/* -------------------------------------------------------------------------- */
/* Get Joined Circles                                                         */
/* -------------------------------------------------------------------------- */

async function getJoinedCircles(
  walletAddress,
) {
  const normalizedWallet =
    normalizeWallet(
      walletAddress,
    )

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

/* -------------------------------------------------------------------------- */
/* Update Circle Status                                                       */
/* -------------------------------------------------------------------------- */

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
    normalizeWallet(
      walletAddress,
    )

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

/* -------------------------------------------------------------------------- */
/* Extend Circle Deadline                                                     */
/* -------------------------------------------------------------------------- */

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
    normalizeWallet(
      walletAddress,
    )

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

/* -------------------------------------------------------------------------- */
/* Update Creator Commitment                                                  */
/* -------------------------------------------------------------------------- */

async function updateCircleCommitment(
  circleId,
  creatorCommitment,
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
    creatorCommitment ===
      undefined ||
    creatorCommitment === null
  ) {
    const error = new Error(
      'creatorCommitment is required',
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
    normalizeWallet(
      walletAddress,
    )

  if (
    circle.creatorWallet !==
    normalizedWallet
  ) {
    const error = new Error(
      'Only the Circle creator can update the creator commitment',
    )

    error.statusCode = 403
    throw error
  }

  if (
    circle.creatorWallet ===
    circle.goalOwnerWallet
  ) {
    const error = new Error(
      'Personal Circles do not have a creator commitment',
    )

    error.statusCode = 400
    throw error
  }

  if (
    circle.status !==
    'active'
  ) {
    const error = new Error(
      'Only active Circles can update the creator commitment',
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
    parsedCreatorCommitment < 1
  ) {
    const error = new Error(
      'creatorCommitment must be a positive integer amount in Luna',
    )

    error.statusCode = 400
    throw error
  }

  if (
    parsedCreatorCommitment >
    circle.targetAmount
  ) {
    const error = new Error(
      'creatorCommitment cannot exceed the Circle target',
    )

    error.statusCode = 400
    throw error
  }

  const creatorContributedAmount =
    await getCreatorContributionTotal(
      circle.circleId,
      circle.creatorWallet,
    )

  if (
    parsedCreatorCommitment <
    creatorContributedAmount
  ) {
    const error = new Error(
      `creatorCommitment cannot be lower than the creator's existing contributions of ${creatorContributedAmount} Luna`,
    )

    error.statusCode = 400
    throw error
  }

  circle.creatorCommitment =
    parsedCreatorCommitment

  await circle.save()

  return circle
}

/* -------------------------------------------------------------------------- */
/* Exports                                                                    */
/* -------------------------------------------------------------------------- */

module.exports = {
  createCircle,
  syncCircleStatus,
  getCircleById,
  getCreatedCircles,
  getJoinedCircles,
  updateCircleStatus,
  extendCircleDeadline,
  updateCircleCommitment,
}