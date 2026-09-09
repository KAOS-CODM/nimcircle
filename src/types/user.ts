export interface User {
  id: string
  displayName: string
  walletAddress: string
  createdAt: string
}

export interface UserSession {
  userId: string
  walletAddress: string
}