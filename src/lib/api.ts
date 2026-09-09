const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3000/api'

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `Request failed with status ${response.status}`,
    )
  }

  return data as T
}

export function getUserByWallet(
  walletAddress: string,
) {
  return request<{
    user: {
      _id: string
      walletAddress: string
      username: string
      displayName: string | null
      avatar: string | null
      bio: string | null
      createdAt: string
      updatedAt: string
    }
  }>(
    `/users/${encodeURIComponent(
      walletAddress,
    )}`,
  )
}

export function createUser(data: {
  walletAddress: string
  username: string
  displayName?: string
}) {
  return request<{
    user: {
      _id: string
      walletAddress: string
      username: string
      displayName: string | null
      avatar: string | null
      bio: string | null
    }
  }>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateUser(
  walletAddress: string,
  data: {
    username?: string
    displayName?: string
    avatar?: string
    bio?: string
  },
) {
  return request<{
    user: {
      _id: string
      walletAddress: string
      username: string
      displayName: string | null
      avatar: string | null
      bio: string | null
    }
  }>(
    `/users/${encodeURIComponent(
      walletAddress,
    )}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )
}

export function createCircle(data: {
  circleId: string
  name: string
  description?: string
  targetAmount: number
  deadline: string
  creatorWallet: string
  creatorUserId: string
}) {
  return request('/circles', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getCircle(
  circleId: string,
) {
  return request(
    `/circles/${encodeURIComponent(
      circleId,
    )}`,
  )
}

export function getCreatedCircles(
  walletAddress: string,
) {
  return request(
    `/circles/creator/${encodeURIComponent(
      walletAddress,
    )}`,
  )
}

export function getJoinedCircles(
  walletAddress: string,
) {
  return request(
    `/circles/joined/${encodeURIComponent(
      walletAddress,
    )}`,
  )
}

export function createContribution(data: {
  circleId: string
  contributorWallet: string
  contributorUserId: string
  amount: number
  transactionHash: string
}) {
  return request('/contributions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getUserContributions(
  walletAddress: string,
) {
  return request(
    `/contributions/user/${encodeURIComponent(
      walletAddress,
    )}`,
  )
}