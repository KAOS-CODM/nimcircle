const express = require('express')

const {
  createUser,
  getUserByWallet,
  getUserStats,
  updateUser,
} = require('../services/userService')

const router = express.Router()

/*
 * Create a user
 *
 * POST /api/users
 */
router.post('/', async (req, res) => {
  try {
    const user =
      await createUser(
        req.body,
      )

    return res.status(201).json({
      user,
    })
  } catch (error) {
    console.error(
      'POST /users failed:',
      error,
    )

    return res.status(
      error.statusCode || 500,
    ).json({
      error:
        error.message ||
        'Failed to create user',
    })
  }
})

/*
 * Get user statistics
 *
 * GET /api/users/:walletAddress/stats
 */
router.get(
  '/:walletAddress/stats',
  async (req, res) => {
    try {
      const stats =
        await getUserStats(
          req.params.walletAddress,
        )

      return res.json({
        stats,
      })
    } catch (error) {
      if (
        error.statusCode === 404
      ) {
        console.log(
          'GET /users/:walletAddress/stats → 404 User not found',
        )
      } else {
        console.error(
          'GET /users/:walletAddress/stats failed:',
          error,
        )
      }

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to fetch user statistics',
      })
    }
  },
)

/*
 * Get a user by wallet address
 *
 * GET /api/users/:walletAddress
 */
router.get(
  '/:walletAddress',
  async (req, res) => {
    try {
      const user =
        await getUserByWallet(
          req.params.walletAddress,
        )

      return res.json({
        user,
      })
    } catch (error) {
      /*
       * A missing profile is expected for
       * first-time NimCircle users.
       */
      if (
        error.statusCode === 404
      ) {
        console.log(
          'GET /users/:walletAddress → 404 User not found',
        )
      } else {
        console.error(
          'GET /users/:walletAddress failed:',
          error,
        )
      }

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to fetch user',
      })
    }
  },
)

/*
 * Update a user's profile
 *
 * PATCH /api/users/:walletAddress
 */
router.patch(
  '/:walletAddress',
  async (req, res) => {
    try {
      const user =
        await updateUser(
          req.params.walletAddress,
          req.body,
        )

      return res.json({
        user,
      })
    } catch (error) {
      console.error(
        'PATCH /users/:walletAddress failed:',
        error,
      )

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to update user',
      })
    }
  },
)

module.exports = router