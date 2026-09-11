export interface Circle {
  id: string
  name: string
  description: string
  targetAmount: number
  deadline: string

  // Wallet that receives contributions.
  recipient: string

  // Wallet that created the Circle.
  creator: string

  // Creator's fixed commitment in NIM.
  creatorCommitment: number

  createdAt: string
}