import { useCallback, useEffect, useRef, useState } from 'react'
import { getNimiq } from '../lib/nimiq'

type WalletStage =
  | 'starting'
  | 'provider-ready'
  | 'requesting-account'
  | 'account-returned'
  | 'failed'

interface WalletDebug {
  providerInitialized: boolean
  accounts: string[]
  accountCount: number | null
  stage: WalletStage
  status: string
}

interface WalletState {
  address: string | null
  loading: boolean
  error: string | null
  debug: WalletDebug
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null) {
    const providerError = error as {
      code?: number | string
      message?: string
      data?: {
        code?: number | string
        message?: string
      }
    }

    const code =
      providerError.code ??
      providerError.data?.code

    const message =
      providerError.message ??
      providerError.data?.message

    if (
      code === 4001 ||
      code === '4001'
    ) {
      return 'You cancelled the wallet connection request.'
    }

    if (message) {
      return message
    }

    try {
      return JSON.stringify(error)
    } catch {
      return String(error)
    }
  }

  return String(error)
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    loading: true,
    error: null,
    debug: {
      providerInitialized: false,
      accounts: [],
      accountCount: null,
      stage: 'starting',
      status: 'Starting wallet connection...',
    },
  })

  const requestPromiseRef = useRef<Promise<void> | null>(null)

  const requestAccounts = useCallback(async () => {
    if (requestPromiseRef.current) {
      return requestPromiseRef.current
    }

    const promise = (async () => {
      try {
        setWallet((current) => ({
          ...current,
          loading: true,
          error: null,
          debug: {
            ...current.debug,
            stage: 'requesting-account',
            status:
              'Requesting your NIM account from Nimiq Pay...',
          },
        }))

        const nimiq = await getNimiq()

        setWallet((current) => ({
          ...current,
          debug: {
            ...current.debug,
            providerInitialized: true,
            stage: 'provider-ready',
            status:
              'Nimiq provider initialized successfully.',
          },
        }))

        const accounts = await nimiq.listAccounts()

        const safeAccounts = Array.isArray(accounts)
          ? accounts
          : []

        const address = safeAccounts[0] ?? null

        if (!address) {
          setWallet({
            address: null,
            loading: false,
            error:
              'Nimiq Pay returned zero NIM accounts.',
            debug: {
              providerInitialized: true,
              accounts: safeAccounts,
              accountCount: safeAccounts.length,
              stage: 'failed',
              status:
                'Provider initialized, but no NIM account was returned.',
            },
          })

          return
        }

        setWallet({
          address,
          loading: false,
          error: null,
          debug: {
            providerInitialized: true,
            accounts: safeAccounts,
            accountCount: safeAccounts.length,
            stage: 'account-returned',
            status:
              'NIM account returned successfully.',
          },
        })
      } catch (error) {
        const message = getErrorMessage(error)

        console.error(
          'Nimiq wallet connection request failed:',
          error,
        )

        setWallet((current) => ({
          address: null,
          loading: false,
          error: message,
          debug: {
            ...current.debug,
            stage: 'failed',
            status:
              'Account request failed. See the error below.',
          },
        }))
      } finally {
        requestPromiseRef.current = null
      }
    })()

    requestPromiseRef.current = promise

    return promise
  }, [])

  const restoreWallet = useCallback(async () => {
    await requestAccounts()
  }, [requestAccounts])

  const connectWallet = useCallback(async () => {
    await requestAccounts()
  }, [requestAccounts])

  useEffect(() => {
    let cancelled = false

    async function initializeProvider() {
      try {
        setWallet((current) => ({
          ...current,
          loading: false,
          debug: {
            ...current.debug,
            stage: 'starting',
            status:
              'Initializing Nimiq provider...',
          },
        }))

        await getNimiq()

        if (cancelled) {
          return
        }

        setWallet((current) => ({
          ...current,
          debug: {
            ...current.debug,
            providerInitialized: true,
            stage: 'provider-ready',
            status:
              'Nimiq provider is ready. Waiting for wallet connection.',
          },
        }))
      } catch (error) {
        if (cancelled) {
          return
        }

        setWallet({
          address: null,
          loading: false,
          error: getErrorMessage(error),
          debug: {
            providerInitialized: false,
            accounts: [],
            accountCount: null,
            stage: 'failed',
            status:
              'Nimiq provider initialization failed.',
          },
        })
      }
    }

    void initializeProvider()

    return () => {
      cancelled = true
    }
  }, [])

  return {
    ...wallet,
    restoreWallet,
    connectWallet,
  }
}