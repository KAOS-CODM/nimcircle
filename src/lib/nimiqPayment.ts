import { getNimiq } from './nimiq'

const LUNA_PER_NIM = 100_000

function nimToLuna(
  nim: number,
): number {
  if (
    !Number.isFinite(nim) ||
    nim <= 0
  ) {
    throw new Error(
      'NIM amount must be greater than zero.',
    )
  }

  const luna =
    Math.round(
      nim * LUNA_PER_NIM,
    )

  if (
    !Number.isSafeInteger(luna)
  ) {
    throw new Error(
      'NIM amount is too large.',
    )
  }

  return luna
}

function normalizeWalletAddress(
  address: string,
): string {
  return address.trim()
}

function formatUserFriendlyAddress(
  address: string,
): string {
  const compactAddress =
    address
      .trim()
      .replace(/\s+/g, '')
      .toUpperCase()

  if (
    !compactAddress
      .toLowerCase()
      .startsWith('nq') ||
    compactAddress.length !== 36
  ) {
    throw new Error(
      'The Circle recipient is not a valid Nimiq address.',
    )
  }

  const groups =
    compactAddress.match(
      /.{1,4}/g,
    )

  if (!groups) {
    throw new Error(
      'The Circle recipient is not a valid Nimiq address.',
    )
  }

  return groups.join(' ')
}

interface SendCircleContributionParams {
  recipientWallet: string
  amountNim: number
  circleId: string
  expectedSender: string
}

export async function sendCircleContribution({
  recipientWallet,
  amountNim,
  circleId,
  expectedSender,
}: SendCircleContributionParams) {
  const nimiq =
    await getNimiq()

  const normalizedExpectedSender =
    normalizeWalletAddress(
      expectedSender,
    )

  if (!normalizedExpectedSender) {
    throw new Error(
      'No Nimiq account is connected.',
    )
  }

  const normalizedRecipient =
    normalizeWalletAddress(
      recipientWallet,
    )

  if (!normalizedRecipient) {
    throw new Error(
      'The Circle has an invalid recipient address.',
    )
  }

  if (
    !normalizedRecipient
      .toLowerCase()
      .startsWith('nq')
  ) {
    throw new Error(
      'The Circle recipient is not a valid Nimiq address.',
    )
  }

  const providerRecipient =
    formatUserFriendlyAddress(
      normalizedRecipient,
    )

  const normalizedCircleId =
    circleId.trim()

  if (!normalizedCircleId) {
    throw new Error(
      'The Circle ID is missing.',
    )
  }

  const consensusEstablished =
    await nimiq.isConsensusEstablished()

  if (!consensusEstablished) {
    throw new Error(
      'Nimiq consensus is not established yet. Please wait for Nimiq Pay to finish syncing and try again.',
    )
  }

  const memo =
    `NC1:${normalizedCircleId}`

  const amountLuna =
    nimToLuna(amountNim)

  /*
   * The provider expects a user-friendly Nimiq
   * address, so the compact application address
   * is formatted only at the provider boundary.
   *
   * The memo remains the actual transaction data.
   */
  const result =
    await nimiq.sendBasicTransactionWithData({
      recipient:
        providerRecipient,

      value:
        amountLuna,

      data:
        memo,
    })

  if (typeof result !== 'string') {
    const providerError =
      result?.error?.message ||
      'Nimiq Pay could not send the transaction.'

    throw new Error(
      providerError,
    )
  }

  return {
    transactionHash:
      result,

    memo,

    amountNim,

    amountLuna,

    recipientWallet:
      normalizedRecipient,

    senderWallet:
      normalizedExpectedSender,
  }
}