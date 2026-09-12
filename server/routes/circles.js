const express = require('express')

const {
  createCircle,
  getCircleById,
  getCreatedCircles,
  getJoinedCircles,
  updateCircleStatus,
  extendCircleDeadline,
} = require('../services/circleService')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const circle =
      await createCircle(req.body)

    return res.status(201).json({
      circle,
    })
  } catch (error) {
    console.error(
      'POST /circles failed:',
      error,
    )

    return res.status(
      error.statusCode || 500,
    ).json({
      error:
        error.message ||
        'Failed to create Circle',
    })
  }
})

router.get(
  '/creator/:walletAddress',
  async (req, res) => {
    try {
      const circles =
        await getCreatedCircles(
          req.params.walletAddress,
        )

      return res.json({
        circles,
      })
    } catch (error) {
      console.error(
        'GET /circles/creator failed:',
        error,
      )

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to fetch created Circles',
      })
    }
  },
)

router.get(
  '/joined/:walletAddress',
  async (req, res) => {
    try {
      const circles =
        await getJoinedCircles(
          req.params.walletAddress,
        )

      return res.json({
        circles,
      })
    } catch (error) {
      console.error(
        'GET /circles/joined failed:',
        error,
      )

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to fetch joined Circles',
      })
    }
  },
)

router.get(
  '/:circleId',
  async (req, res) => {
    try {
      const result =
        await getCircleById(
          req.params.circleId,
        )

      return res.json(result)
    } catch (error) {
      console.error(
        'GET /circles/:circleId failed:',
        error,
      )

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to fetch Circle',
      })
    }
  },
)

router.patch(
  '/:circleId/status',
  async (req, res) => {
    try {
      const {
        status,
        walletAddress,
      } = req.body

      const circle =
        await updateCircleStatus(
          req.params.circleId,
          status,
          walletAddress,
        )

      return res.json({
        circle,
      })
    } catch (error) {
      console.error(
        'PATCH /circles/:circleId/status failed:',
        error,
      )

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to update Circle status',
      })
    }
  },
)

router.patch(
  '/:circleId/deadline',
  async (req, res) => {
    try {
      const {
        deadline,
        walletAddress,
      } = req.body

      const circle =
        await extendCircleDeadline(
          req.params.circleId,
          deadline,
          walletAddress,
        )

      return res.json({
        circle,
      })
    } catch (error) {
      console.error(
        'PATCH /circles/:circleId/deadline failed:',
        error,
      )

      return res.status(
        error.statusCode || 500,
      ).json({
        error:
          error.message ||
          'Failed to extend Circle deadline',
      })
    }
  },
)

module.exports = router