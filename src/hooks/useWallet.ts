import { useEffect, useState } from 'react'
import { getNimiq } from '../lib/nimiq'

interface WalletState {
  address: string | null
  loading: boolean
  error: string | null
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    loading: true,
    error: null,
  })

  async function connect() {
    try {
      const nimiq = await getNimiq()
      const accounts = await nimiq.listAccounts()

      if (!Array.isArray(accounts)) {
        setWallet({
          address: null,
          loading: false,
          error: 'Unable to retrieve the NIM account.',
        })

        return
      }

      const address = accounts[0] ?? null

      setWallet({
        address,
        loading: false,
        error: address
          ? null
          : 'No NIM account is available.',
      })
    } catch (error) {
      setWallet({
        address: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      })
    }
  }

  useEffect(() => {
    let cancelled = false

    async function loadWallet() {
      try {
        const nimiq = await getNimiq()
        const accounts = await nimiq.listAccounts()

        if (cancelled) return

        if (!Array.isArray(accounts)) {
          setWallet({
            address: null,
            loading: false,
            error: 'Unable to retrieve the NIM account.',
          })

          return
        }

        const address = accounts[0] ?? null

        setWallet({
          address,
          loading: false,
          error: address
            ? null
            : 'No NIM account is available.',
        })
      } catch (error) {
        if (cancelled) return

        setWallet({
          address: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : String(error),
        })
      }
    }

    void loadWallet()

    return () => {
      cancelled = true
    }
  }, [])

  return {
    ...wallet,
    connect,
  }
}