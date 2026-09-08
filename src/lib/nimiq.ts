import { init } from '@nimiq/mini-app-sdk'

let nimiqPromise: ReturnType<typeof init> | null = null

export function getNimiq() {
  if (!nimiqPromise) {
    nimiqPromise = init({ timeout: 10_000 })
  }

  return nimiqPromise
}