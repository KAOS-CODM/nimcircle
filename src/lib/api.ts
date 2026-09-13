import type { Circle } from '../types/circle'
import type { User } from '../types/user'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:9000/api`

const LUNA_PER_NIM = 100_000

/* -------------------------------------------------------------------------- */
/* Wallet normalization                                                       */
/* -------------------------------------------------------------------------- */

function normalizeWalletAddress(
  walletAddress: string,
): string {
  return walletAddress
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase()
}

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

  goalOwnerWallet: string
  goalOwnerUserId: string | null

  creatorCommitment: number

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
  creatorCommitment: number
}

interface ApiContribution {
  _id: string
  circleId: string

  contributorWallet: string
  contributorUserId: string

  recipientWallet: string

  amount: number

  transactionHash: string

  memo: string

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
  code?: string | null
  retryable?: boolean
}

interface ApiNetworkConfigResponse {
  network: 'testnet' | 'mainnet'
}

/* -------------------------------------------------------------------------- */
/* API error                                                                   */
/* -------------------------------------------------------------------------- */

export class ApiRequestError extends Error {
  status: number
  code: string | null
  retryable: boolean

  constructor(
    message: string,
    options: {
      status: number
      code?: string | null
      retryable?: boolean
      cause?: unknown
    },
  ) {
    super(message, {
      cause: options.cause,
    })

    this.name = 'ApiRequestError'
    this.status = options.status
    this.code = options.code ?? null
    this.retryable =
      options.retryable === true
  }
}

/* -------------------------------------------------------------------------- */
/* Backend error mapping                                                      */
/*                                                                            */
/* The backend continues returning its existing English messages.            */
/* We convert those messages into stable frontend error codes here so the    */
/* UI can display the currently selected language.                            */
/* -------------------------------------------------------------------------- */

function getApiErrorCode(
  message: string,
): string | null {
  const normalized =
    message
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')

  const errorMap: Record<string, string> = {
    /* ------------------------------ Users -------------------------------- */

    'walletaddress and username are required':
      'WALLET_USERNAME_REQUIRED',

    'username must be between 3 and 20 characters':
      'USERNAME_LENGTH',

    'username can only contain letters, numbers, and underscores':
      'USERNAME_FORMAT',

    'display name must be 30 characters or fewer':
      'DISPLAY_NAME_LENGTH',

    'a profile already exists for this wallet':
      'PROFILE_EXISTS',

    'that username is already taken':
      'USERNAME_TAKEN',

    'a user with this wallet address or username already exists':
      'USER_ALREADY_EXISTS',

    'user not found':
      'USER_NOT_FOUND',

    'no valid fields to update':
      'NO_VALID_UPDATE_FIELDS',

    /* ----------------------------- Circles ------------------------------- */

    'name, targetamount, deadline, creatorwallet, creatoruserid, goalownerwallet and creatorcommitment are required':
      'CIRCLE_FIELDS_REQUIRED',

    'creator user not found':
      'CREATOR_NOT_FOUND',

    'creator wallet does not match the user':
      'CREATOR_WALLET_MISMATCH',

    'goal owner user not found':
      'GOAL_OWNER_NOT_FOUND',

    'goal owner wallet does not match the user':
      'GOAL_OWNER_WALLET_MISMATCH',

    'targetamount must be a positive integer amount in luna':
      'TARGET_AMOUNT_INVALID',

    'creatorcommitment must be a non-negative integer amount in luna':
      'CREATOR_COMMITMENT_INVALID',

    'creatorcommitment cannot exceed the circle target':
      'CREATOR_COMMITMENT_TOO_LARGE',

    'invalid deadline':
      'INVALID_DEADLINE',

    'deadline must be in the future':
      'DEADLINE_NOT_FUTURE',

    'a circle with this id already exists':
      'CIRCLE_ALREADY_EXISTS',

    'circle not found':
      'CIRCLE_NOT_FOUND',

    'walletaddress is required':
      'WALLET_REQUIRED',

    'the only manual status change allowed is cancellation':
      'INVALID_STATUS_CHANGE',

    'only the circle creator can cancel it':
      'ONLY_CREATOR_CAN_CANCEL',

    'this circle can no longer change status':
      'CIRCLE_STATUS_LOCKED',

    'only the circle creator can extend the deadline':
      'ONLY_CREATOR_CAN_EXTEND',

    'this circle can no longer extend its deadline':
      'CIRCLE_DEADLINE_LOCKED',

    'deadline is required':
      'DEADLINE_REQUIRED',

    'new deadline must be later than the current deadline':
      'DEADLINE_MUST_BE_LATER',

    /* --------------------------- Contributions --------------------------- */

    'transaction hash is required':
      'TRANSACTION_HASH_REQUIRED',

    'transaction was not found in the nimiq blockchain history':
      'TRANSACTION_NOT_FOUND',

    'transaction has not been confirmed on the nimiq blockchain':
      'TRANSACTION_NOT_CONFIRMED',

    'the nimiq transaction failed':
      'TRANSACTION_FAILED',

    'transaction recipient does not match the circle goal owner':
      'RECIPIENT_MISMATCH',

    'transaction amount does not match the contribution amount':
      'AMOUNT_MISMATCH',

    'transaction memo does not match the circle':
      'MEMO_MISMATCH',

    'transaction sender does not match the contributor wallet':
      'SENDER_MISMATCH',

    'contribution not found':
      'CONTRIBUTION_NOT_FOUND',
  }

  return (
    errorMap[normalized] ??
    null
  )
}

/* -------------------------------------------------------------------------- */
/* NIM / Luna conversion                                                      */
/* -------------------------------------------------------------------------- */

export function nimToLuna(
  nim: number,
): number {
  if (
    !Number.isFinite(nim) ||
    nim <= 0
  ) {
    throw new ApiRequestError(
      'NIM amount must be greater than zero.',
      {
        status: 400,
        code: 'NIM_AMOUNT_INVALID',
      },
    )
  }

  const luna =
    Math.round(
      nim * LUNA_PER_NIM,
    )

  if (!Number.isSafeInteger(luna)) {
    throw new ApiRequestError(
      'NIM amount is too large.',
      {
        status: 400,
        code: 'NIM_AMOUNT_TOO_LARGE',
      },
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
/* App configuration                                                          */
/* -------------------------------------------------------------------------- */

export async function apiGetNetworkConfig(): Promise<
  'testnet' | 'mainnet'
> {
  const response =
    await request<ApiNetworkConfigResponse>(
      '/config',
    )

  return response.network
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
      normalizeWalletAddress(
        user.walletAddress,
      ),

    createdAt:
      user.createdAt,
  }
}

async function enrichCircleWithUsernames(
  circle: Circle,
): Promise<Circle> {
  const [
    creatorUsername,
    recipientUsername,
  ] = await Promise.all([
    apiGetUsername(circle.creator),
    apiGetUsername(circle.recipient),
  ])

  return {
    ...circle,

    creatorUsername,

    recipientUsername,
  }
}

async function enrichContributionWithUsername(
  contribution: ApiContribution,
): Promise<
  ApiContribution & {
    contributorUsername?: string
  }
> {
  const contributorUsername =
    await apiGetUsername(
      contribution.contributorWallet,
    )

  return {
    ...contribution,

    contributorUsername,
  }
}

function mapApiCircle(
  circle: ApiCircle,
): Circle {
  return {
    id: circle.circleId,

    name: circle.name,

    description:
      circle.description,

    targetAmount:
      lunaToNim(
        circle.targetAmount,
      ),

    deadline:
      circle.deadline,

    recipient:
      normalizeWalletAddress(
        circle.goalOwnerWallet,
      ),

    creator:
      normalizeWalletAddress(
        circle.creatorWallet,
      ),

    creatorCommitment:
      lunaToNim(
        circle.creatorCommitment,
      ),

    status: circle.status,

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
  const url = `${API_BASE_URL}${endpoint}`

  console.log(
    '[NimCircle API] Request:',
    url,
  )

  let response: Response

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
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

    throw new ApiRequestError(
      `Unable to reach the NimCircle API at ${url}. Browser error: ${message}`,
      {
        status: 0,
        code: 'NETWORK_ERROR',
        retryable: true,
        cause: error,
      },
    )
  }

  let data: T | ApiErrorResponse

  try {
    data = await response.json()
  } catch {
    console.error(
      '[NimCircle API] Invalid JSON response:',
      {
        url,
        status: response.status,
      },
    )

    throw new ApiRequestError(
      `The server returned an invalid response (${response.status}).`,
      {
        status: response.status,
        code: 'INVALID_RESPONSE',
        retryable:
          response.status >= 500,
      },
    )
  }

  console.log(
    '[NimCircle API] Response:',
    {
      url,
      status: response.status,
      data,
    },
  )

  if (!response.ok) {
    const errorData =
      data as ApiErrorResponse

    const message =
      errorData.error ||
      `API request failed with status ${response.status}.`

    throw new ApiRequestError(
      message,
      {
        status: response.status,
        code:
          errorData.code ??
          getApiErrorCode(message),
        retryable:
          errorData.retryable === true,
      },
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
          JSON.stringify({
            ...data,

            walletAddress:
              normalizeWalletAddress(
                data.walletAddress,
              ),
          }),
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
        normalizeWalletAddress(
          walletAddress,
        ),
      )}`,
    )

  return mapApiUser(
    response.user,
  )
}

export async function apiGetUsername(
  walletAddress: string,
): Promise<string> {
  const response =
    await request<ApiUserResponse>(
      `/users/${encodeURIComponent(
        normalizeWalletAddress(
          walletAddress,
        ),
      )}`,
    )

  return (
    response.user.username ||
    response.user.displayName ||
    walletAddress
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
        normalizeWalletAddress(
          walletAddress,
        ),
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
        normalizeWalletAddress(
          walletAddress,
        ),
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
    creatorUserId: string
    goalOwnerWallet: string
    goalOwnerUserId?: string | null
    creatorCommitment: number
  },
): Promise<Circle> {
  const response =
    await request<ApiCircleResponse>(
      '/circles',
      {
        method: 'POST',

        body:
          JSON.stringify({
            name:
              data.name,

            description:
              data.description,

            targetAmount:
              nimToLuna(
                data.targetAmount,
              ),

            deadline:
              data.deadline,

            creatorWallet:
              normalizeWalletAddress(
                data.creatorWallet,
              ),

            creatorUserId:
              data.creatorUserId,

            goalOwnerWallet:
              normalizeWalletAddress(
                data.goalOwnerWallet,
              ),

            goalOwnerUserId:
              data.goalOwnerUserId ?? null,

            creatorCommitment:
              nimToLuna(
                data.creatorCommitment,
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
    creatorCommitment: number
  }

  contributions: ApiContribution[]
}> {
  const response =
    await request<ApiCircleDetailsResponse>(
      `/circles/${encodeURIComponent(
        circleId,
      )}`,
    )

  const circle =
    await enrichCircleWithUsernames(
      mapApiCircle(
        response.circle,
      ),
    )

  const contributions =
    await Promise.all(
      response.contributions.map(
        enrichContributionWithUsername,
      ),
    )

  return {
    circle,

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

      creatorCommitment:
        lunaToNim(
          response.stats
            .creatorCommitment,
        ),
    },

    contributions,
  }
}

export async function apiGetCreatedCircles(
  walletAddress: string,
): Promise<Circle[]> {
  const response =
    await request<ApiCirclesResponse>(
      `/circles/creator/${encodeURIComponent(
        normalizeWalletAddress(
          walletAddress,
        ),
      )}`,
    )

  const circles =
    response.circles.map(
      mapApiCircle,
    )

  return Promise.all(
    circles.map(
      enrichCircleWithUsernames,
    ),
  )
}

export async function apiGetJoinedCircles(
  walletAddress: string,
): Promise<Circle[]> {
  const response =
    await request<ApiCirclesResponse>(
      `/circles/joined/${encodeURIComponent(
        normalizeWalletAddress(
          walletAddress,
        ),
      )}`,
    )

  const circles =
    response.circles.map(
      mapApiCircle,
    )

  return Promise.all(
    circles.map(
      enrichCircleWithUsernames,
    ),
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

        body:
          JSON.stringify({
            status:
              'cancelled',

            walletAddress:
              normalizeWalletAddress(
                creatorWallet,
              ),
          }),
      },
    )

  return mapApiCircle(
    response.circle,
  )
}

export async function apiExtendCircleDeadline(
  circleId: string,
  deadline: string,
  creatorWallet: string,
): Promise<Circle> {
  const response =
    await request<ApiCircleResponse>(
      `/circles/${encodeURIComponent(
        circleId,
      )}/deadline`,
      {
        method: 'PATCH',

        body:
          JSON.stringify({
            deadline,

            walletAddress:
              normalizeWalletAddress(
                creatorWallet,
              ),
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

export async function apiCreateContribution(
  data: {
    circleId: string
    contributorWallet: string
    contributorUserId: string
    recipientWallet: string
    amount: number
    transactionHash: string
    memo: string
  },
) {
  return request<ApiContributionResponse>(
    '/contributions',
    {
      method: 'POST',

      body:
        JSON.stringify({
          circleId:
            data.circleId,

          contributorWallet:
            normalizeWalletAddress(
              data.contributorWallet,
            ),

          contributorUserId:
            data.contributorUserId,

          recipientWallet:
            normalizeWalletAddress(
              data.recipientWallet,
            ),

          amount:
            nimToLuna(
              data.amount,
            ),

          transactionHash:
            data.transactionHash,

          memo:
            data.memo,
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
        normalizeWalletAddress(
          walletAddress,
        ),
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

export async function apiConfirmContribution(
  transactionHash: string,
) {
  return request<ApiContributionResponse>(
    `/contributions/${encodeURIComponent(
      transactionHash,
    )}/confirm`,
    {
      method: 'PATCH',
    },
  )
}