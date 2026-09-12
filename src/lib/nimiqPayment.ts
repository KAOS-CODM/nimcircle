import { getNimiq } from './nimiq'

const LUNA_PER_NIM = 100_000

export const PAYMENT_ERROR_CODES = {
  NO_ACCOUNT: 'NIMIQ_NO_ACCOUNT',
  INVALID_RECIPIENT: 'NIMIQ_INVALID_RECIPIENT',
  INVALID_RECIPIENT_FORMAT:
    'NIMIQ_INVALID_RECIPIENT_FORMAT',
  MISSING_CIRCLE_ID: 'NIMIQ_MISSING_CIRCLE_ID',
  CONSENSUS_NOT_ESTABLISHED:
    'NIMIQ_CONSENSUS_NOT_ESTABLISHED',
  AMOUNT_INVALID: 'NIM_AMOUNT_INVALID',
  AMOUNT_TOO_LARGE: 'NIM_AMOUNT_TOO_LARGE',
  TRANSACTION_FAILED:
    'NIMIQ_TRANSACTION_FAILED',
} as const

function createPaymentError(
  code: string,
): Error & { code: string } {
  const error = new Error(code) as Error & {
    code: string
  }

  error.code = code

  return error
}

function nimToLuna(
  nim: number,
): number {
  if (
    !Number.isFinite(nim) ||
    nim <= 0
  ) {
    throw createPaymentError(
      PAYMENT_ERROR_CODES.AMOUNT_INVALID,
    )
  }

  const luna =
    Math.round(
      nim * LUNA_PER_NIM,
    )

  if (
    !Number.isSafeInteger(luna)
  ) {
    throw createPaymentError(
      PAYMENT_ERROR_CODES.AMOUNT_TOO_LARGE,
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
    throw createPaymentError(
      PAYMENT_ERROR_CODES.INVALID_RECIPIENT_FORMAT,
    )
  }

  const groups =
    compactAddress.match(
      /.{1,4}/g,
    )

  if (!groups) {
    throw createPaymentError(
      PAYMENT_ERROR_CODES.INVALID_RECIPIENT_FORMAT,
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
    throw createPaymentError(
      PAYMENT_ERROR_CODES.NO_ACCOUNT,
    )
  }

  const normalizedRecipient =
    normalizeWalletAddress(
      recipientWallet,
    )

  if (!normalizedRecipient) {
    throw createPaymentError(
      PAYMENT_ERROR_CODES.INVALID_RECIPIENT,
    )
  }

  if (
    !normalizedRecipient
      .toLowerCase()
      .startsWith('nq')
  ) {
    throw createPaymentError(
      PAYMENT_ERROR_CODES.INVALID_RECIPIENT_FORMAT,
    )
  }

  const providerRecipient =
    formatUserFriendlyAddress(
      normalizedRecipient,
    )

  const normalizedCircleId =
    circleId.trim()

  if (!normalizedCircleId) {
    throw createPaymentError(
      PAYMENT_ERROR_CODES.MISSING_CIRCLE_ID,
    )
  }

  const consensusEstablished =
    await nimiq.isConsensusEstablished()

  if (!consensusEstablished) {
    throw createPaymentError(
      PAYMENT_ERROR_CODES.CONSENSUS_NOT_ESTABLISHED,
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
      result?.error?.message

    if (providerError) {
      throw new Error(
        providerError,
      )
    }

    throw createPaymentError(
      PAYMENT_ERROR_CODES.TRANSACTION_FAILED,
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