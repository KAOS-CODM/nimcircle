import type { Circle } from '../types/circle'
import type { User } from '../types/user'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:3000/api`

const LUNA_PER_NIM = 100_000

/* -------------------------------------------------------------------------- */
/* Backend response types                                                     */
/* -------------------------------------------------------------------------- */

interface ApiUser {
  _id: string
  walletAddress: string
  username: string
  displayName: string
  avatar: string
  bio: string
  createdAt: string
  updatedAt: string
}

interface ApiUserResponse {
  user: ApiUser
}

interface ApiUserStats {
  createdCircles: number
  joinedCircles: number
  totalContributed: number
}

interface ApiUserStatsResponse {
  stats: ApiUserStats
}

interface ApiCircle {
  circleId: string
  name: string
  description: string
  targetAmount: number
  deadline: string
  creatorWallet: string
  creatorUserId: string
  recipientWallet: string
  status:
    | 'active'
    | 'completed'
    | 'expired'
    | 'cancelled'
  completedAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
}

interface ApiCircleResponse {
  circle: ApiCircle
}

interface ApiCirclesResponse {
  circles: ApiCircle[]
}

interface ApiCircleStats {
  raisedAmount: number
  targetAmount: number
  remainingAmount: number
  progressPercentage: number
  contributorCount: number
}

interface ApiContribution {
  _id: string
  circleId: string
  contributorWallet: string
  contributorUserId: string
  amount: number
  transactionHash: string
  status:
    | 'pending'
    | 'confirmed'
    | 'failed'
  confirmedAt: string | null
  createdAt: string
  updatedAt: string
}

interface ApiContributionResponse {
  contribution: ApiContribution
}

interface ApiContributionsResponse {
  contributions: ApiContribution[]
}

interface ApiCircleDetailsResponse {
  circle: ApiCircle
  stats: ApiCircleStats
  contributions: ApiContribution[]
}

interface ApiErrorResponse {
  error?: string
}

/* -------------------------------------------------------------------------- */
/* NIM / Luna conversion                                                      */
/* -------------------------------------------------------------------------- */

export function nimToLuna(
  nim: number,
): number {
  if (!Number.isFinite(nim) || nim <= 0) {
    throw new Error(
      'NIM amount must be greater than zero.',
    )
  }

  const luna =
    Math.round(
      nim * LUNA_PER_NIM,
    )

  if (!Number.isSafeInteger(luna)) {
    throw new Error(
      'NIM amount is too large.',
    )
  }

  return luna
}

export function lunaToNim(
  luna: number,
): number {
  if (!Number.isFinite(luna)) {
    return 0
  }

  return luna / LUNA_PER_NIM
}

/* -------------------------------------------------------------------------- */
/* Mapping backend models to frontend models                                  */
/* -------------------------------------------------------------------------- */

function mapApiUser(
  user: ApiUser,
): User {
  return {
    id: user._id,
    displayName:
      user.displayName ||
      user.username,
    walletAddress:
      user.walletAddress,
    createdAt:
      user.createdAt,
  }
}

function mapApiCircle(
  circle: ApiCircle,
): Circle {
  return {
    id: circle.circleId,
    name: circle.name,
    description: circle.description,
    targetAmount:
      lunaToNim(
        circle.targetAmount,
      ),
    deadline:
      circle.deadline,
    recipient:
      circle.recipientWallet,
    creator:
      circle.creatorWallet,
    createdAt:
      circle.createdAt,
  }
}

/* -------------------------------------------------------------------------- */
/* Generic API request                                                        */
/* -------------------------------------------------------------------------- */

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url =
    `${API_BASE_URL}${endpoint}`

  console.log(
    '[NimCircle API] Request:',
    url,
  )

  let response: Response

  try {
    response =
      await fetch(
        url,
        {
          ...options,
          headers: {
            'Content-Type':
              'application/json',
            ...(options.headers || {}),
          },
        },
      )
    } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error)

    console.error(
      '[NimCircle API] Network request failed:',
      {
        url,
        error,
      },
    )

    throw new Error(
      `Unable to reach the NimCircle API at ${url}. Browser error: ${message}`,
      {
        cause: error,
      },
    )
  }

  let data: T | ApiErrorResponse

  try {
    data =
      await response.json()
  } catch {
    console.error(
      '[NimCircle API] Invalid JSON response:',
      {
        url,
        status:
          response.status,
      },
    )

    throw new Error(
      `The server returned an invalid response (${response.status}).`,
    )
  }

  console.log(
    '[NimCircle API] Response:',
    {
      url,
      status:
        response.status,
      data,
    },
  )

  if (!response.ok) {
    const errorData =
      data as ApiErrorResponse

    throw new Error(
      errorData.error ||
        `API request failed with status ${response.status}.`,
    )
  }

  return data as T
}

/* -------------------------------------------------------------------------- */
/* Users                                                                      */
/* -------------------------------------------------------------------------- */

export async function apiCreateUser(
  data: {
    walletAddress: string
    username: string
    displayName?: string
    avatar?: string
    bio?: string
  },
): Promise<User> {
  const response =
    await request<ApiUserResponse>(
      '/users',
      {
        method: 'POST',
        body:
          JSON.stringify(data),
      },
    )

  return mapApiUser(
    response.user,
  )
}

export async function apiGetUser(
  walletAddress: string,
): Promise<User> {
  const response =
    await request<ApiUserResponse>(
      `/users/${encodeURIComponent(
        walletAddress,
      )}`,
    )

  return mapApiUser(
    response.user,
  )
}

export async function apiGetUserStats(
  walletAddress: string,
): Promise<{
  createdCircles: number
  joinedCircles: number
  totalContributed: number
}> {
  const response =
    await request<ApiUserStatsResponse>(
      `/users/${encodeURIComponent(
        walletAddress,
      )}/stats`,
    )

  return {
    createdCircles:
      response.stats
        .createdCircles,

    joinedCircles:
      response.stats
        .joinedCircles,

    totalContributed:
      lunaToNim(
        response.stats
          .totalContributed,
      ),
  }
}

export async function apiUpdateUser(
  walletAddress: string,
  updates: {
    username?: string
    displayName?: string
    avatar?: string
    bio?: string
  },
): Promise<User> {
  const response =
    await request<ApiUserResponse>(
      `/users/${encodeURIComponent(
        walletAddress,
      )}`,
      {
        method: 'PATCH',
        body:
          JSON.stringify(updates),
      },
    )

  return mapApiUser(
    response.user,
  )
}

/* -------------------------------------------------------------------------- */
/* Circles                                                                    */
/* -------------------------------------------------------------------------- */

export async function apiCreateCircle(
  data: {
    name: string
    description: string
    targetAmount: number
    deadline: string
    creatorWallet: string
    recipientWallet: string
    creatorUserId: string
  },
): Promise<Circle> {
  const response =
    await request<ApiCircleResponse>(
      '/circles',
      {
        method: 'POST',
        body: JSON.stringify({
          ...data,

          targetAmount:
            nimToLuna(
              data.targetAmount,
            ),
        }),
      },
    )

  return mapApiCircle(
    response.circle,
  )
}

export async function apiGetCircle(
  circleId: string,
): Promise<{
  circle: Circle
  stats: {
    raisedAmount: number
    targetAmount: number
    remainingAmount: number
    progressPercentage: number
    contributorCount: number
  }
  contributions: ApiContribution[]
}> {
  const response =
    await request<ApiCircleDetailsResponse>(
      `/circles/${encodeURIComponent(
        circleId,
      )}`,
    )

  return {
    circle:
      mapApiCircle(
        response.circle,
      ),

    stats: {
      raisedAmount:
        lunaToNim(
          response.stats
            .raisedAmount,
        ),

      targetAmount:
        lunaToNim(
          response.stats
            .targetAmount,
        ),

      remainingAmount:
        lunaToNim(
          response.stats
            .remainingAmount,
        ),

      progressPercentage:
        response.stats
          .progressPercentage,

      contributorCount:
        response.stats
          .contributorCount,
    },

    contributions:
      response.contributions,
  }
}

export async function apiGetCreatedCircles(
  walletAddress: string,
): Promise<Circle[]> {
  const response =
    await request<ApiCirclesResponse>(
      `/circles/creator/${encodeURIComponent(
        walletAddress,
      )}`,
    )

  return response.circles.map(
    mapApiCircle,
  )
}

export async function apiGetJoinedCircles(
  walletAddress: string,
): Promise<Circle[]> {
  const response =
    await request<ApiCirclesResponse>(
      `/circles/joined/${encodeURIComponent(
        walletAddress,
      )}`,
    )

  return response.circles.map(
    mapApiCircle,
  )
}

export async function apiCancelCircle(
  circleId: string,
  creatorWallet: string,
): Promise<Circle> {
  const response =
    await request<ApiCircleResponse>(
      `/circles/${encodeURIComponent(
        circleId,
      )}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'cancelled',
          walletAddress:
            creatorWallet,
        }),
      },
    )

  return mapApiCircle(
    response.circle,
  )
}

/* -------------------------------------------------------------------------- */
/* Contributions                                                              */
/* -------------------------------------------------------------------------- */

export async function apiCreateContribution(data: {
  circleId: string
  contributorWallet: string
  contributorUserId: string
  amount: number
  transactionHash: string
}) {
  return request<ApiContributionResponse>(
    '/contributions',
    {
      method: 'POST',
      body: JSON.stringify({
        circleId: data.circleId,
        contributorWallet:
          data.contributorWallet,
        contributorUserId:
          data.contributorUserId,
        amount: nimToLuna(data.amount),
        transactionHash:
          data.transactionHash,
      }),
    },
  )
}

export async function apiGetUserContributions(
  walletAddress: string,
): Promise<ApiContribution[]> {
  const response =
    await request<ApiContributionsResponse>(
      `/contributions/user/${encodeURIComponent(
        walletAddress,
      )}`,
    )

  return response.contributions
}

export async function apiGetCircleContributions(
  circleId: string,
): Promise<ApiContribution[]> {
  const response =
    await request<ApiContributionsResponse>(
      `/contributions/circle/${encodeURIComponent(
        circleId,
      )}`,
    )

  return response.contributions
}