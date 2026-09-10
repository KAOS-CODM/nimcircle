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

  if (
    normalizedUsername.length < 3 ||
    normalizedUsername.length > 20
  ) {
    const error = new Error(
      'Username must be between 3 and 20 characters',
    )

    error.statusCode = 400
    throw error
  }

  if (
    !/^[a-z0-9_]+$/.test(
      normalizedUsername,
    )
  ) {
    const error = new Error(
      'Username can only contain letters, numbers, and underscores',
    )

    error.statusCode = 400
    throw error
  }

  const trimmedDisplayName =
    displayName?.trim() || ''

  if (
    trimmedDisplayName.length > 30
  ) {
    const error = new Error(
      'Display name must be 30 characters or fewer',
    )

    error.statusCode = 400
    throw error
  }

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
    if (
      existingUser.walletAddress ===
      normalizedWallet
    ) {
      const error = new Error(
        'A profile already exists for this wallet',
      )

      error.statusCode = 409
      throw error
    }

    if (
      existingUser.username ===
      normalizedUsername
    ) {
      const error = new Error(
        'That username is already taken',
      )

      error.statusCode = 409
      throw error
    }

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
      trimmedDisplayName,

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
    const username =
      updates.username
        .trim()
        .toLowerCase()

    if (
      username.length < 3 ||
      username.length > 20
    ) {
      const error = new Error(
        'Username must be between 3 and 20 characters',
      )

      error.statusCode = 400
      throw error
    }

    if (
      !/^[a-z0-9_]+$/.test(
        username,
      )
    ) {
      const error = new Error(
        'Username can only contain letters, numbers, and underscores',
      )

      error.statusCode = 400
      throw error
    }

    allowedUpdates.username =
      username
  }

  if (
    updates.displayName !==
    undefined
  ) {
    const displayName =
      updates.displayName.trim()

    if (
      displayName.length > 30
    ) {
      const error = new Error(
        'Display name must be 30 characters or fewer',
      )

      error.statusCode = 400
      throw error
    }

    allowedUpdates.displayName =
      displayName
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
          'That username is already taken',
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