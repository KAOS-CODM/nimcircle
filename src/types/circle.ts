export interface Circle {
  id: string

  name: string

  description: string

  targetAmount: number

  deadline: string

  recipient: string

  recipientUsername?: string

  creator: string

  creatorUsername?: string

  creatorCommitment: number

  status:
    | 'active'
    | 'completed'
    | 'expired'
    | 'cancelled'

  createdAt: string
}