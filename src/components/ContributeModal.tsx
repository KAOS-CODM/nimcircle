import { useState } from 'react'
import {
  apiConfirmContribution,
  apiCreateContribution,
  nimToLuna,
} from '../lib/api'
import {
  PAYMENT_ERROR_CODES,
  sendCircleContribution,
} from '../lib/nimiqPayment'
import { useLanguage } from '../i18n/useLanguage'

interface ContributeModalProps {
  circleId: string
  recipient: string
  remainingAmount: number
  contributorWallet: string
  contributorUserId: string
  fixedAmountNim?: number
  onClose: () => void
  onSuccess: () => void
}

interface ErrorTranslations {
  transactionCancelled: string
  serverUnavailable: string
  processingError: string
  transactionConfirmationFailed: string

  paymentNoAccount: string
  paymentInvalidRecipient: string
  paymentInvalidRecipientFormat: string
  paymentMissingCircleId: string
  paymentConsensusNotEstablished: string
  paymentAmountInvalid: string
  paymentAmountTooLarge: string
  paymentTransactionFailed: string
}

function getErrorMessage(
  error: unknown,
  translations: ErrorTranslations,
): string {
  if (
    error &&
    typeof error === 'object'
  ) {
    const errorObject = error as {
      code?: number | string
      message?: string
      type?: string
      error?: {
        code?: number | string
        message?: string
        type?: string
      }
    }

    const code =
      errorObject.code ??
      errorObject.error?.code

    const message =
      errorObject.message ??
      errorObject.error?.message ??
      ''

    const paymentErrorTranslations: Record<
      string,
      string
    > = {
      [PAYMENT_ERROR_CODES.NO_ACCOUNT]:
        translations.paymentNoAccount,

      [PAYMENT_ERROR_CODES.INVALID_RECIPIENT]:
        translations.paymentInvalidRecipient,

      [PAYMENT_ERROR_CODES.INVALID_RECIPIENT_FORMAT]:
        translations.paymentInvalidRecipientFormat,

      [PAYMENT_ERROR_CODES.MISSING_CIRCLE_ID]:
        translations.paymentMissingCircleId,

      [PAYMENT_ERROR_CODES.CONSENSUS_NOT_ESTABLISHED]:
        translations.paymentConsensusNotEstablished,

      [PAYMENT_ERROR_CODES.AMOUNT_INVALID]:
        translations.paymentAmountInvalid,

      [PAYMENT_ERROR_CODES.AMOUNT_TOO_LARGE]:
        translations.paymentAmountTooLarge,

      [PAYMENT_ERROR_CODES.TRANSACTION_FAILED]:
        translations.paymentTransactionFailed,
    }

    if (
      typeof code === 'string' &&
      paymentErrorTranslations[code]
    ) {
      return paymentErrorTranslations[code]
    }

    const normalizedMessage =
      message.toLowerCase()

    if (
      code === 4001 ||
      code === '4001'
    ) {
      return translations.transactionCancelled
    }

    if (
      normalizedMessage.includes(
        'user rejected',
      ) ||
      normalizedMessage.includes(
        'user denied',
      ) ||
      normalizedMessage.includes(
        'user cancelled',
      ) ||
      normalizedMessage.includes(
        'user canceled',
      ) ||
      normalizedMessage.includes(
        'request rejected',
      ) ||
      normalizedMessage.includes(
        'request denied',
      )
    ) {
      return translations.transactionCancelled
    }

    if (
      normalizedMessage.includes(
        'failed to fetch',
      ) ||
      normalizedMessage.includes(
        'network error',
      ) ||
      normalizedMessage.includes(
        'network request failed',
      ) ||
      normalizedMessage.includes(
        'fetch failed',
      ) ||
      normalizedMessage.includes(
        'connection refused',
      ) ||
      normalizedMessage.includes(
        'failed to connect',
      ) ||
      normalizedMessage.includes(
        'econnrefused',
      ) ||
      normalizedMessage.includes(
        'enotfound',
      )
    ) {
      return translations.serverUnavailable
    }

    if (message) {
      return message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return translations.processingError
}

function isTransactionNotFoundError(
  error: unknown,
  translations: ErrorTranslations,
): boolean {
  const message =
    getErrorMessage(
      error,
      translations,
    ).toLowerCase()

  return (
    message.includes(
      'transaction not found',
    ) ||
    message.includes('not found')
  )
}

function wait(
  milliseconds: number,
): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds,
    )
  })
}

async function confirmContributionWithRetry(
  transactionHash: string,
  translations: ErrorTranslations,
): Promise<void> {
  const maxAttempts = 30
  const retryDelay = 2_000

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt += 1
  ) {
    try {
      await apiConfirmContribution(
        transactionHash,
      )

      return
    } catch (confirmationError) {
      const shouldRetry =
        isTransactionNotFoundError(
          confirmationError,
          translations,
        )

      const hasAttemptsRemaining =
        attempt < maxAttempts

      if (
        !shouldRetry ||
        !hasAttemptsRemaining
      ) {
        throw confirmationError
      }

      await wait(retryDelay)
    }
  }

  throw new Error(
    translations.transactionConfirmationFailed,
  )
}

export default function ContributeModal({
  circleId,
  recipient,
  remainingAmount,
  contributorWallet,
  contributorUserId,
  fixedAmountNim,
  onClose,
  onSuccess,
}: ContributeModalProps) {
  const { t } = useLanguage()

  const [amount, setAmount] =
    useState(
      fixedAmountNim !== undefined
        ? fixedAmountNim.toString()
        : '',
    )

  const isFixedAmount =
    fixedAmountNim !== undefined

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState(false)

  const [transactionHash, setTransactionHash] =
    useState<string | null>(null)

  /*const [paymentSent, setPaymentSent] =
    useState(false)*/

  const parsedAmount = Number(amount)

  const isValidAmount =
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount <= remainingAmount

  const errorTranslations = {
    transactionCancelled:
      t.contributeModal.transactionCancelled,

    serverUnavailable:
      t.contributeModal.serverUnavailable,

    processingError:
      t.contributeModal.processingError,

    transactionConfirmationFailed:
      t.contributeModal.transactionConfirmationFailed,

    paymentNoAccount:
      t.contributeModal.paymentNoAccount,

    paymentInvalidRecipient:
      t.contributeModal.paymentInvalidRecipient,

    paymentInvalidRecipientFormat:
      t.contributeModal.paymentInvalidRecipientFormat,

    paymentMissingCircleId:
      t.contributeModal.paymentMissingCircleId,

    paymentConsensusNotEstablished:
      t.contributeModal.paymentConsensusNotEstablished,

    paymentAmountInvalid:
      t.contributeModal.paymentAmountInvalid,

    paymentAmountTooLarge:
      t.contributeModal.paymentAmountTooLarge,

    paymentTransactionFailed:
      t.contributeModal.paymentTransactionFailed,
  }

  async function handleContribute() {
    setError(null)
    //setPaymentSent(false)
    setTransactionHash(null)

    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      setError(
        t.contributeModal.validAmount,
      )
      return
    }

    if (
      parsedAmount > remainingAmount
    ) {
      setError(
        t.contributeModal.maximumAmount.replace(
          '{amount}',
          remainingAmount.toLocaleString(),
        ),
      )
      return
    }

    let lunaAmount: number

    try {
      lunaAmount =
        nimToLuna(parsedAmount)
    } catch (conversionError) {
      setError(
        getErrorMessage(
          conversionError,
          errorTranslations,
        ),
      )
      return
    }

    if (lunaAmount < 1) {
      setError(
        t.contributeModal.minimumAmount,
      )
      return
    }

    if (
      isFixedAmount &&
      parsedAmount !== fixedAmountNim
    ) {
      setError(
        t.contributeModal
          .creatorCommitmentCannotChange,
      )
      return
    }

    const normalizedRecipient =
      recipient.trim()

    if (!normalizedRecipient) {
      setError(
        t.contributeModal.invalidRecipient,
      )
      return
    }

    setIsSubmitting(true)

    /*
     * Keep this local variable as the source
     * of truth for the current payment attempt.
     *
     * React state updates such as setPaymentSent()
     * are asynchronous, so the state value may still
     * be false if an error occurs immediately after
     * the transaction is sent.
     */
    let sentTransactionHash:
      string | null = null

    try {
      console.log(
        '[NimCircle] Sending Circle contribution...',
      )

      const payment =
        await sendCircleContribution({
          recipientWallet:
            normalizedRecipient,
          amountNim:
            parsedAmount,
          circleId,
          expectedSender:
            contributorWallet,
        })

      console.log(
        '[NimCircle] Payment sent:',
        payment,
      )

      const hash =
        payment.transactionHash

      /*
       * The transaction hash is the reliable
       * indicator that Nimiq Pay accepted and
       * returned the transaction.
       */
      sentTransactionHash = hash

      setTransactionHash(hash)
      //setPaymentSent(true)

      await apiCreateContribution({
        circleId,
        contributorWallet,
        contributorUserId,
        recipientWallet:
          normalizedRecipient,
        amount: parsedAmount,
        transactionHash: hash,
        memo: payment.memo,
      })

      console.log(
        '[NimCircle] Waiting for blockchain confirmation...',
      )

      await confirmContributionWithRetry(
        hash,
        errorTranslations,
      )

      console.log(
        '[NimCircle] Contribution confirmed:',
        hash,
      )

      setSuccess(true)

      //onSuccess()
    } catch (requestError) {
      console.error(
        '[NimCircle] Contribution failed:',
        requestError,
      )

      const message =
        getErrorMessage(
          requestError,
          errorTranslations,
        )

      /*
       * If we already received a transaction hash,
       * the payment was sent even if the backend
       * creation or confirmation failed afterward.
       *
       * Do not rely on paymentSent here because
       * React state updates are asynchronous.
       */
      if (sentTransactionHash) {
        setError(
          `${t.contributeModal.transactionSentWarning} ${t.contributeModal.transactionLabel.replace(
            '{hash}',
            sentTransactionHash,
          )}`,
        )
      } else {
        setError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 py-4 backdrop-blur-sm sm:items-center">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="bg-slate-950 px-6 pb-7 pt-8 text-white">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-300 text-2xl font-black text-slate-950">
                ✓
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-lime-300">
                {t.contributeModal.transaction}
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight">
                {t.contributeModal.contributionConfirmed}
              </h2>
            </div>
          </div>

          <div className="px-6 pb-6 pt-6">
            <p className="text-center text-sm leading-6 text-slate-500">
              {t.contributeModal
                .contributionConfirmedDescription.replace(
                  '{amount}',
                  parsedAmount.toLocaleString(),
                )}
            </p>

            {transactionHash && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  {t.contributeModal.transaction}
                </p>

                <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-600">
                  {transactionHash}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={async () => {
                await onSuccess()
                onClose()
              }}
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              {t.contributeModal.done}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950 px-6 pb-6 pt-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-lime-300">
                {t.contributeModal.sharedGoal}
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight">
                {isFixedAmount
                  ? t.contributeModal
                      .confirmCreatorCommitment
                  : t.contributeModal
                      .contributeNim}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label={
                t.contributeModal.close
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg text-white transition hover:bg-white/15 disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-6">
          {/* Amount */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="contribution-amount"
                className="text-sm font-black text-slate-900"
              >
                {isFixedAmount
                  ? t.contributeModal
                      .creatorCommitment
                  : t.contributeModal.amount}
              </label>

              <span className="rounded-full bg-lime-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-700">
                NIM
              </span>
            </div>

            <div className="relative mt-2">
              <input
                id="contribution-amount"
                type="number"
                inputMode="decimal"
                min="0.00001"
                max={remainingAmount}
                step="0.00001"
                value={amount}
                onChange={(event) => {
                  if (isFixedAmount) {
                    return
                  }

                  setAmount(
                    event.target.value,
                  )

                  setError(null)
                }}
                readOnly={isFixedAmount}
                disabled={isSubmitting}
                placeholder="0"
                className={`min-h-16 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-20 text-2xl font-black text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 ${
                  isFixedAmount
                    ? 'cursor-default'
                    : ''
                }`}
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                NIM
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                {isFixedAmount
                  ? t.contributeModal
                      .fixedCommitment
                  : t.contributeModal.remaining}
              </span>

              <span className="font-bold text-slate-700">
                {isFixedAmount
                  ? `${fixedAmountNim?.toLocaleString()} NIM`
                  : `${remainingAmount.toLocaleString()} NIM`}
              </span>
            </div>
          </div>

          {/* Recipient */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3.75 5.25 6.5v5.25c0 4.35 2.78 7.7 6.75 8.5 3.97-.8 6.75-4.15 6.75-8.5V6.5L12 3.75Z"
                  />
                </svg>
              </div>

              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                {t.contributeModal.recipient}
              </p>
            </div>

            <p className="mt-3 break-all font-mono text-xs leading-5 text-slate-600">
              {recipient}
            </p>
          </div>

          {/* Memo */}
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.25h13.5v13.5H5.25z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9h7.5M8.25 12h7.5M8.25 15h4.5"
                  />
                </svg>
              </div>

              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                {t.contributeModal.circleMemo}
              </p>
            </div>

            <p className="mt-3 break-all font-mono text-xs leading-5 text-slate-600">
              NC1:{circleId}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16h.01"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                    />
                  </svg>
                </div>

                <p className="min-w-0 text-sm leading-5 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Action */}
          <button
            type="button"
            onClick={handleContribute}
            disabled={
              isSubmitting ||
              !isValidAmount
            }
            className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-5 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-lime-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="opacity-25"
                />

                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {isSubmitting
              ? t.contributeModal
                  .confirmContribution
              : isFixedAmount
                ? t.contributeModal
                    .contributeAmount.replace(
                      '{amount}',
                      amount,
                    )
                : amount
                  ? t.contributeModal
                      .contributeAmount.replace(
                        '{amount}',
                        amount,
                      )
                  : t.contributeModal.contribute}
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-slate-400">
            {t.contributeModal.walletApproval}
          </p>
        </div>
      </div>
    </div>
  )
}