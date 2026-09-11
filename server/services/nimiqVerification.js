const Nimiq = require('@nimiq/core')

const NETWORK =
  process.env.NIMIQ_NETWORK || 'TestAlbatross'

const TEST_ALBATROSS_SEEDS = [
  '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
  '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
  '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
]

const MAIN_ALBATROSS_SEEDS = [
  '/dns4/aurora.seed.nimiq.com/tcp/443/wss',
  '/dns4/catalyst.seed.nimiq.network/tcp/443/wss',
  '/dns4/cipher.seed.nimiq-network.com/tcp/443/wss',
  '/dns4/eclipse.seed.nimiq.cloud/tcp/443/wss',
]

let clientPromise = null

function normalizeAddress(address) {
  return String(address || '')
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase()
}

function formatUserFriendlyAddress(address) {
  const compactAddress =
    normalizeAddress(address)

  if (
    !compactAddress ||
    !compactAddress.startsWith('nq') ||
    compactAddress.length !== 36
  ) {
    throw new Error(
      'Invalid Nimiq address',
    )
  }

  return compactAddress
    .toUpperCase()
    .match(/.{1,4}/g)
    .join(' ')
}

function decodeTransactionData(data) {
  if (
    data === null ||
    data === undefined
  ) {
    return ''
  }

  if (
    typeof data === 'object' &&
    typeof data.raw === 'string'
  ) {
    data = data.raw
  }

  if (typeof data !== 'string') {
    return String(data)
  }

  const normalized = data.trim()

  if (!normalized) {
    return ''
  }

  if (
    normalized.length % 2 === 0 &&
    /^[0-9a-fA-F]+$/.test(normalized)
  ) {
    try {
      return Buffer.from(
        normalized,
        'hex',
      ).toString('utf8')
    } catch {
      return normalized
    }
  }

  return normalized
}

async function getNimiqClient() {
  if (!clientPromise) {
    clientPromise =
      (async () => {
        const config =
          new Nimiq.ClientConfiguration()

        if (
          NETWORK === 'MainAlbatross'
        ) {
          config.network(
            'MainAlbatross',
          )

          config.seedNodes(
            MAIN_ALBATROSS_SEEDS,
          )
        } else {
          config.network(
            'TestAlbatross',
          )

          config.seedNodes(
            TEST_ALBATROSS_SEEDS,
          )
        }

        const client =
          await Nimiq.Client.create(
            config.build(),
          )

        await client.waitForConsensusEstablished()

        return client
      })().catch((error) => {
        clientPromise = null
        throw error
      })
  }

  return clientPromise
}

async function getTransactionByHash(
  transactionHash,
  recipientWallet,
) {
  const client =
    await getNimiqClient()

  const address =
    formatUserFriendlyAddress(
      recipientWallet,
    )

  const transactions =
    await client.getTransactionsByAddress(
      address,
    )

  const normalizedHash =
    transactionHash
      .trim()
      .toLowerCase()

  return (
    transactions.find(
      (transaction) =>
        String(
          transaction.transactionHash ||
            '',
        )
          .trim()
          .toLowerCase() ===
        normalizedHash,
    ) || null
  )
}

async function verifyContributionTransaction({
  transactionHash,
  contributorWallet,
  recipientWallet,
  amount,
  memo,
}) {
  if (!transactionHash) {
    return {
      valid: false,
      reason:
        'Transaction hash is required',
    }
  }

  let transaction

  try {
    transaction =
      await getTransactionByHash(
        transactionHash,
        recipientWallet,
      )
  } catch (error) {
    return {
      valid: false,
      reason:
        `Failed to query the Nimiq blockchain: ${error.message}`,
    }
  }

  if (!transaction) {
    return {
      valid: false,
      reason:
        'Transaction was not found in the Nimiq blockchain history',
    }
  }

  if (
    transaction.state !==
      'confirmed' &&
    transaction.state !==
      'included'
  ) {
    return {
      valid: false,
      reason:
        'Transaction has not been confirmed on the Nimiq blockchain',
      transaction,
    }
  }

  if (
    transaction.executionResult ===
    false
  ) {
    return {
      valid: false,
      reason:
        'The Nimiq transaction failed',
      transaction,
    }
  }

  const expectedRecipient =
    normalizeAddress(
      recipientWallet,
    )

  const actualRecipient =
    normalizeAddress(
      transaction.recipient,
    )

  if (!actualRecipient) {
    return {
      valid: false,
      reason:
        'Transaction does not contain a valid recipient address',
      transaction,
    }
  }

  if (
    actualRecipient !==
    expectedRecipient
  ) {
    return {
      valid: false,
      reason:
        'Transaction recipient does not match the Circle goal owner',
      transaction,
    }
  }

  const actualAmount =
    Number(transaction.value)

  const expectedAmount =
    Number(amount)

  if (
    !Number.isSafeInteger(
      actualAmount,
    ) ||
    actualAmount !==
      expectedAmount
  ) {
    return {
      valid: false,
      reason:
        'Transaction amount does not match the contribution amount',
      transaction,
    }
  }

  const actualMemo =
    decodeTransactionData(
      transaction.data,
    )

  const expectedMemo =
    typeof memo === 'string'
      ? memo.trim()
      : ''

  if (
    actualMemo !==
    expectedMemo
  ) {
    return {
      valid: false,
      reason:
        'Transaction memo does not match the Circle',
      transaction,
    }
  }

  const expectedContributor =
    normalizeAddress(
      contributorWallet,
    )

  let contributorMatches =
    false

  if (
    transaction.senderType ===
    'htlc'
  ) {
    const creator =
      normalizeAddress(
        transaction.proof?.creator,
      )

    contributorMatches =
      creator ===
      expectedContributor
  } else {
    const sender =
      normalizeAddress(
        transaction.sender,
      )

    contributorMatches =
      sender ===
      expectedContributor
  }

  if (!contributorMatches) {
    return {
      valid: false,
      reason:
        'Transaction sender does not match the contributor wallet',
      transaction,
    }
  }

  return {
    valid: true,
    transaction,
  }
}

module.exports = {
  getTransactionByHash,
  verifyContributionTransaction,
}