const express = require('express')

const {
  createContribution,
  confirmContribution,
  getUserContributions,
  getCircleContributions,
} = require('../services/contributionService')

const router = express.Router()

/*
 * Record a contribution
 *
 * POST /api/contributions
 */
router.post('/', async (req, res) => {
  try {
    const contribution =
      await createContribution(
        req.body,
      )

    return res.status(201).json({
      contribution,
    })
  } catch (error) {
    console.error(
      'POST /contributions failed:',
      error,
    )

    const response = {
      error:
        error.message ||
        'Failed to record contribution',
    }

    if (error.contribution) {
      response.contribution =
        error.contribution
    }

    return res.status(
      error.statusCode || 500,
    ).json(response)
  }
})

/*
 * Confirm a contribution
 *
 * TEMPORARY MVP endpoint.
 *
 * Later this must verify the transaction
 * against the Nimiq blockchain.
 *
 * PATCH /api/contributions/:transactionHash/confirm
 */
router.patch(
  '/:transactionHash/confirm',
  async (req, res) => {
    try {
      const contribution =
        await confirmContribution(
          req.params
            .transactionHash,
        )

      return res.json({
        contribution,
      })
    } catch (error) {
      console.error(
        'PATCH /contributions/:transactionHash/confirm failed:',
        error,
      )

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to confirm contribution',
      })
    }
  },
)

/*
 * Get contributions made by a user
 *
 * GET /api/contributions/user/:walletAddress
 */
router.get(
  '/user/:walletAddress',
  async (req, res) => {
    try {
      const contributions =
        await getUserContributions(
          req.params.walletAddress,
        )

      return res.json({
        contributions,
      })
    } catch (error) {
      console.error(
        'GET /contributions/user failed:',
        error,
      )

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to fetch contributions',
      })
    }
  },
)

/*
 * Get confirmed contributions for a Circle
 *
 * GET /api/contributions/circle/:circleId
 */
router.get(
  '/circle/:circleId',
  async (req, res) => {
    try {
      const contributions =
        await getCircleContributions(
          req.params.circleId,
        )

      return res.json({
        contributions,
      })
    } catch (error) {
      console.error(
        'GET /contributions/circle failed:',
        error,
      )

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to fetch Circle contributions',
      })
    }
  },
)

module.exports = router