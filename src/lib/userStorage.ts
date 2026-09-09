import type { User, UserSession } from '../types/user'

const USER_STORAGE_PREFIX = 'nimcircle:user:'
const SESSION_STORAGE_KEY = 'nimcircle:session'

function getUserStorageKey(address: string) {
  return `${USER_STORAGE_PREFIX}${address.toLowerCase()}`
}

function createUserId() {
  return `user_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`
}

export function getUserByWallet(
  walletAddress: string,
): User | null {
  const stored = localStorage.getItem(
    getUserStorageKey(walletAddress),
  )

  if (!stored) {
    return null
  }

  try {
    const parsed = JSON.parse(stored)

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.id !== 'string' ||
      typeof parsed.displayName !== 'string' ||
      typeof parsed.walletAddress !== 'string' ||
      typeof parsed.createdAt !== 'string'
    ) {
      return null
    }

    return parsed as User
  } catch {
    localStorage.removeItem(
      getUserStorageKey(walletAddress),
    )

    return null
  }
}

export function createUser(
  displayName: string,
  walletAddress: string,
): User {
  const user: User = {
    id: createUserId(),
    displayName: displayName.trim(),
    walletAddress,
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem(
    getUserStorageKey(walletAddress),
    JSON.stringify(user),
  )

  return user
}

export function saveUser(user: User) {
  localStorage.setItem(
    getUserStorageKey(user.walletAddress),
    JSON.stringify(user),
  )
}

export function getSession(): UserSession | null {
  const stored = localStorage.getItem(
    SESSION_STORAGE_KEY,
  )

  if (!stored) {
    return null
  }

  try {
    const parsed = JSON.parse(stored)

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.userId !== 'string' ||
      typeof parsed.walletAddress !== 'string'
    ) {
      return null
    }

    return parsed as UserSession
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)

    return null
  }
}

export function saveSession(
  user: User,
) {
  const session: UserSession = {
    userId: user.id,
    walletAddress: user.walletAddress,
  }

  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(session),
  )
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

export function clearUser(
  walletAddress: string,
) {
  localStorage.removeItem(
    getUserStorageKey(walletAddress),
  )
}