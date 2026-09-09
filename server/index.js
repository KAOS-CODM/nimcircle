const express = require('express')
const Contribution = require('../models/Contribution')
const Circle = require('../models/Circle')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const {
      circleId,
      contributorWallet,
      contributorUserId,
      amount,
      transactionHash,
    } = req.body

    if (
      !circleId ||
      !contributorWallet ||
      !contributorUserId ||
      !amount ||
      !transactionHash
    ) {
      return res.status(400).json({
        error:
          'circleId, contributorWallet, contributorUserId, amount and transactionHash are required',
      })
    }

    const circle = await Circle.findOne({
      circleId,
    })

    if (!circle) {
      return res.status(404).json({
        error: 'Circle not found',
      })
    }

    if (circle.status !== 'active') {
      return res.status(400).json({
        error:
          'This Circle is no longer accepting contributions',
      })
    }

    const existingContribution =
      await Contribution.findOne({
        transactionHash: transactionHash.trim(),
      })

    if (existingContribution) {
      return res.status(409).json({
        error:
          'This transaction has already been recorded',
        contribution: existingContribution,
      })
    }

    const contribution =
      await Contribution.create({
        circleId,
        contributorWallet:
          contributorWallet.trim(),
        contributorUserId,
        amount: Number(amount),
        transactionHash:
          transactionHash.trim(),
        status: 'pending',
      })

    return res.status(201).json({
      contribution,
    })
  } catch (error) {
    console.error(
      'POST /contributions failed:',
      error,
    )

    return res.status(500).json({
      error: 'Failed to record contribution',
    })
  }
})

router.patch('/:transactionHash/confirm', async (req, res) => {
  try {
    const contribution =
      await Contribution.findOneAndUpdate(
        {
          transactionHash:
            req.params.transactionHash,
        },
        {
          $set: {
            status: 'confirmed',
            confirmedAt: new Date(),
          },
        },
        {
          new: true,
        },
      )

    if (!contribution) {
      return res.status(404).json({
        error: 'Contribution not found',
      })
    }

    return res.json({
      contribution,
    })
  } catch (error) {
    console.error(
      'PATCH /contributions/:transactionHash/confirm failed:',
      error,
    )

    return res.status(500).json({
      error: 'Failed to confirm contribution',
    })
  }
})

router.get('/user/:walletAddress', async (req, res) => {
  try {
    const contributions =
      await Contribution.find({
        contributorWallet:
          req.params.walletAddress,
        status: 'confirmed',
      })
        .sort({
          createdAt: -1,
        })
        .lean()

    return res.json({
      contributions,
    })
  } catch (error) {
    console.error(
      'GET /contributions/user failed:',
      error,
    )

    return res.status(500).json({
      error: 'Failed to fetch contributions',
    })
  }
})

module.exports = router