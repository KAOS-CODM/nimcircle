const User = require('../models/User')
const Circle = require('../models/Circle')
const Contribution = require('../models/Contribution')

async function createUser({
  walletAddress,
  username,
  displayName,
  avatar,
  bio,
}) {
  if (!walletAddress || !username) {
    const error = new Error(
      'walletAddress and username are required',
    )

    error.statusCode = 400
    throw error
  }

  const normalizedWallet =
    walletAddress.trim().toLowerCase()

  const normalizedUsername =
    username.trim().toLowerCase()

  const existingUser =
    await User.findOne({
      $or: [
        {
          walletAddress:
            normalizedWallet,
        },
        {
          username:
            normalizedUsername,
        },
      ],
    })

  if (existingUser) {
    const error = new Error(
      'A user with this wallet address or username already exists',
    )

    error.statusCode = 409
    throw error
  }

  return User.create({
    walletAddress:
      normalizedWallet,

    username:
      normalizedUsername,

    displayName:
      displayName?.trim() || '',

    avatar:
      avatar?.trim() || '',

    bio:
      bio?.trim() || '',
  })
}

async function getUserByWallet(
  walletAddress,
) {
  const normalizedWallet =
    walletAddress.trim().toLowerCase()

  const user =
    await User.findOne({
      walletAddress:
        normalizedWallet,
    }).lean()

  if (!user) {
    const error = new Error(
      'User not found',
    )

    error.statusCode = 404
    throw error
  }

  return user
}

async function getUserStats(
  walletAddress,
) {
  const normalizedWallet =
    walletAddress.trim().toLowerCase()

  const user =
    await User.findOne({
      walletAddress:
        normalizedWallet,
    }).lean()

  if (!user) {
    const error = new Error(
      'User not found',
    )

    error.statusCode = 404
    throw error
  }

  const createdCircles =
    await Circle.countDocuments({
      creatorWallet:
        normalizedWallet,
    })

  const joinedCircleIds =
    await Contribution.distinct(
      'circleId',
      {
        contributorWallet:
          normalizedWallet,

        status: 'confirmed',
      },
    )

  const contributionTotal =
    await Contribution.aggregate([
      {
        $match: {
          contributorWallet:
            normalizedWallet,

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

  const totalContributed =
    contributionTotal[0]?.total || 0

  return {
    createdCircles,
    joinedCircles:
      joinedCircleIds.length,
    totalContributed,
  }
}

async function updateUser(
  walletAddress,
  updates,
) {
  const normalizedWallet =
    walletAddress.trim().toLowerCase()

  const allowedUpdates = {}

  if (updates.username !== undefined) {
    allowedUpdates.username =
      updates.username
        .trim()
        .toLowerCase()
  }

  if (
    updates.displayName !==
    undefined
  ) {
    allowedUpdates.displayName =
      updates.displayName.trim()
  }

  if (updates.avatar !== undefined) {
    allowedUpdates.avatar =
      updates.avatar.trim()
  }

  if (updates.bio !== undefined) {
    allowedUpdates.bio =
      updates.bio.trim()
  }

  if (
    Object.keys(
      allowedUpdates,
    ).length === 0
  ) {
    const error = new Error(
      'No valid fields to update',
    )

    error.statusCode = 400
    throw error
  }

  try {
    const user =
      await User.findOneAndUpdate(
        {
          walletAddress:
            normalizedWallet,
        },
        {
          $set: allowedUpdates,
        },
        {
          new: true,
          runValidators: true,
        },
      )

    if (!user) {
      const error = new Error(
        'User not found',
      )

      error.statusCode = 404
      throw error
    }

    return user
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    if (error.code === 11000) {
      const duplicateError =
        new Error(
          'A user with this username already exists',
        )

      duplicateError.statusCode = 409

      throw duplicateError
    }

    throw error
  }
}

module.exports = {
  createUser,
  getUserByWallet,
  getUserStats,
  updateUser,
}