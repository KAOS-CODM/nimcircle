const express = require('express')

const router = express.Router()

const NETWORK =
  process.env.NIMIQ_NETWORK || 'TestAlbatross'

router.get('/', (req, res) => {
  const isTestnet =
    NETWORK !== 'MainAlbatross'

  res.json({
    success: true,
    network: isTestnet
      ? 'testnet'
      : 'mainnet',
  })
})

module.exports = router