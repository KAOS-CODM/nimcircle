import { useState } from 'react'
import {
  apiConfirmContribution,
  apiCreateContribution,
  nimToLuna,
} from '../lib/api'
import { sendCircleContribution } from '../lib/nimiqPayment'

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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object') {
    const errorObject = error as {
      error?: {
        type?: string
        message?: string
      }
      message?: string
      type?: string
    }

    if (errorObject.error?.message) {
      return errorObject.error.message
    }

    if (errorObject.message) {
      return errorObject.message
    }

    try {
      return JSON.stringify(error)
    } catch {
      return 'Something went wrong while sending the contribution.'
    }
  }

  return 'Something went wrong while sending the contribution.'
}

function isTransactionNotFoundError(
  error: unknown,
): boolean {
  const message =
    getErrorMessage(error).toLowerCase()

  return (
    message.includes('transaction not found') ||
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
    'The transaction could not be confirmed.',
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

  const parsedAmount = Number(amount)

  const isValidAmount =
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount <= remainingAmount

  async function handleContribute() {
    setError(null)

    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      setError(
        'Enter a valid NIM amount.',
      )
      return
    }

    if (
      parsedAmount > remainingAmount
    ) {
      setError(
        `You can contribute a maximum of ${remainingAmount.toLocaleString()} NIM.`,
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
        ),
      )
      return
    }

    if (lunaAmount < 1) {
      setError(
        'The minimum contribution is 0.00001 NIM.',
      )
      return
    }

    if (
      isFixedAmount &&
      parsedAmount !== fixedAmountNim
    ) {
      setError(
        'Your creator commitment cannot be changed.',
      )
      return
    }

    const normalizedRecipient =
      recipient.trim()

    if (!normalizedRecipient) {
      setError(
        'This Circle has an invalid recipient address.',
      )
      return
    }

    setIsSubmitting(true)

    try {
      /*
       * Step 1:
       * Send the actual NIM payment through
       * the shared Nimiq payment helper.
       *
       * The helper checks:
       * - connected account
       * - expected contributor wallet
       * - Nimiq consensus
       * - transaction recipient
       * - transaction amount
       * - Circle memo
       */
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

      setTransactionHash(hash)

      /*
       * Step 2:
       * Store the transaction as pending.
       *
       * The backend does not trust the client here.
       */
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

      /*
       * Step 3:
       * Ask the backend to verify the transaction
       * against the Nimiq blockchain.
       *
       * A newly submitted transaction may take a
       * moment before the RPC can find it, so we
       * retry only when the transaction is not found.
       */
      console.log(
        '[NimCircle] Waiting for blockchain confirmation...',
      )

      await confirmContributionWithRetry(
        hash,
      )

      /*
       * Step 4:
       * The backend has now verified the
       * transaction. The contribution is confirmed.
       */
      console.log(
        '[NimCircle] Contribution confirmed:',
        hash,
      )

      setSuccess(true)

      onSuccess()
    } catch (requestError) {
      console.error(
        '[NimCircle] Contribution failed:',
        requestError,
      )

      setError(
        getErrorMessage(
          requestError,
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c7f36b] text-xl font-bold text-[#162018]">
            ✓
          </div>

          <h2 className="mt-5 text-center text-xl font-bold">
            Contribution confirmed
          </h2>

          <p className="mt-2 text-center text-sm leading-6 text-[#607060]">
            Your{' '}
            {parsedAmount.toLocaleString()} NIM
            contribution has been confirmed on the
            Nimiq blockchain.
          </p>

          {transactionHash && (
            <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
                Transaction
              </p>

              <p className="mt-2 break-all font-mono text-xs text-[#162018]/70">
                {transactionHash}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-5 min-h-12 w-full rounded-2xl bg-[#162018] px-5 py-3 text-sm font-bold text-white transition-transform active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607060]">
              Shared goal
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {isFixedAmount
                ? 'Confirm creator commitment'
                : 'Contribute NIM'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7f8f5] text-lg text-[#607060] disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <label
            htmlFor="contribution-amount"
            className="text-sm font-semibold text-[#162018]"
          >
            {isFixedAmount
              ? 'Creator commitment'
              : 'Amount'}
          </label>
        
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
              className={`min-h-14 w-full rounded-2xl border border-black/10 bg-[#f7f8f5] px-4 pr-16 text-xl font-bold text-[#162018] outline-none focus:border-[#162018]/30 ${
                isFixedAmount
                  ? 'cursor-default'
                : ''
              }`}
            />
        
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#607060]">
              NIM
            </span>
          </div>
        
          <div className="mt-2 flex items-center justify-between text-xs text-[#607060]">
            <span>
              {isFixedAmount
                ? 'Fixed commitment'
                : 'Remaining'}
            </span>
        
            <span className="font-semibold">
              {isFixedAmount
                ? `${fixedAmountNim?.toLocaleString()} NIM`
                : `${remainingAmount.toLocaleString()} NIM`}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#f7f8f5] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Recipient
          </p>

          <p className="mt-2 break-all font-mono text-xs leading-5 text-[#162018]/70">
            {recipient}
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-[#f7f8f5] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#607060]">
            Circle memo
          </p>

          <p className="mt-2 break-all font-mono text-xs leading-5 text-[#162018]/70">
            NC1:{circleId}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm leading-5 text-red-700">
              {error}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleContribute}
          disabled={
            isSubmitting ||
            !isValidAmount
          }
          className="mt-5 min-h-13 w-full rounded-2xl bg-[#c7f36b] px-5 py-3 text-sm font-bold text-[#162018] shadow-sm transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? 'Confirming contribution...'
            : isFixedAmount
              ? `Contribute ${amount} NIM`
              : `Contribute${
                  amount
                    ? ` ${amount} NIM`
                    : ''
                }`}
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-[#607060]">
          Nimiq Pay will ask you to approve this
          transaction.
        </p>
      </div>
    </div>
  )
}