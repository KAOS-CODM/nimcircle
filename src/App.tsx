import { useEffect, useState } from 'react'
import { init } from '@nimiq/mini-app-sdk'

function App() {
  const [status, setStatus] = useState('Connecting to Nimiq Pay...')
  const [consensus, setConsensus] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    async function connect() {
      try {
        const nimiq = await init({ timeout: 10_000 })

        if (cancelled) return

        const isConsensusEstablished =
          await nimiq.isConsensusEstablished()

        if (cancelled) return

        setConsensus(isConsensusEstablished)
        setStatus('Nimiq provider connected')
      } catch (error) {
        if (cancelled) return

        setStatus(
          error instanceof Error
            ? error.message
            : String(error),
        )
      }
    }

    connect()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main>
      <h1>NimCircle</h1>

      <p>{status}</p>

      {consensus !== null && (
        <p>
          Nimiq consensus:{' '}
          {consensus ? 'Established' : 'Not established'}
        </p>
      )}
    </main>
  )
}

export default App