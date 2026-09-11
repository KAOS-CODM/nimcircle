import { useCallback, useEffect, useState } from 'react'
import {
  apiCreateCircle,
  apiGetCircle,
  apiGetCreatedCircles,
  apiGetJoinedCircles,
} from '../lib/api'
import type { Circle } from '../types/circle'
import type { User } from '../types/user'

interface CreateCircleData {
  name: string
  description: string
  targetAmount: number
  deadline: string
  goalOwnerWallet: string
  goalOwnerUserId?: string | null
  creatorCommitment: number
}

export interface CircleProgress {
  raisedAmount: number
  targetAmount: number
  remainingAmount: number
  progressPercentage: number
  contributorCount: number
}

interface UseCirclesResult {
  circles: Circle[]
  joinedCircles: Circle[]
  circleProgress: Record<string, CircleProgress>
  loadingCircles: boolean
  loadingJoinedCircles: boolean
  circleError: string | null
  joinedCircleError: string | null
  creatingCircle: boolean
  createCircle: (
    data: CreateCircleData,
  ) => Promise<Circle>
  refreshCircles: () => Promise<void>
}

function normalizeWalletAddress(
  address: string,
): string {
  return address
    .trim()
    .replace(/\s+/g, '')
}

export function useCircles(
  address: string,
  user: User,
): UseCirclesResult {
  const [circles, setCircles] = useState<Circle[]>([])
  const [joinedCircles, setJoinedCircles] =
    useState<Circle[]>([])

  const [circleProgress, setCircleProgress] =
    useState<Record<string, CircleProgress>>({})

  const [loadingCircles, setLoadingCircles] =
    useState(true)

  const [loadingJoinedCircles, setLoadingJoinedCircles] =
    useState(true)

  const [circleError, setCircleError] =
    useState<string | null>(null)

  const [joinedCircleError, setJoinedCircleError] =
    useState<string | null>(null)

  const [creatingCircle, setCreatingCircle] =
    useState(false)

  const loadCircleProgress = useCallback(
    async (circleList: Circle[]) => {
      if (circleList.length === 0) {
        return
      }

      const results = await Promise.all(
        circleList.map(async (circle) => {
          try {
            const response =
              await apiGetCircle(circle.id)

            return {
              circleId: circle.id,
              progress: {
                raisedAmount:
                  response.stats.raisedAmount,

                targetAmount:
                  response.stats.targetAmount,

                remainingAmount:
                  response.stats.remainingAmount,

                progressPercentage:
                  response.stats.progressPercentage,

                contributorCount:
                  response.stats.contributorCount,
              },
            }
          } catch {
            return null
          }
        }),
      )

      setCircleProgress((current) => {
        const next = {
          ...current,
        }

        for (const result of results) {
          if (!result) {
            continue
          }

          next[result.circleId] =
            result.progress
        }

        return next
      })
    },
    [],
  )

  const refreshCircles = useCallback(
    async () => {
      setLoadingCircles(true)
      setLoadingJoinedCircles(true)

      setCircleError(null)
      setJoinedCircleError(null)

      try {
        const [
          createdResult,
          joinedResult,
        ] = await Promise.allSettled([
          apiGetCreatedCircles(address),
          apiGetJoinedCircles(address),
        ])

        let createdCircles: Circle[] = []
        let joined: Circle[] = []

        if (
          createdResult.status ===
          'fulfilled'
        ) {
          createdCircles =
            createdResult.value

          setCircles(createdCircles)
        } else {
          const message =
            createdResult.reason instanceof
            Error
              ? createdResult.reason.message
              : String(
                  createdResult.reason,
                )

          setCircleError(message)
        }

        if (
          joinedResult.status ===
          'fulfilled'
        ) {
          joined =
            joinedResult.value

          setJoinedCircles(joined)
        } else {
          const message =
            joinedResult.reason instanceof
            Error
              ? joinedResult.reason.message
              : String(
                  joinedResult.reason,
                )

          setJoinedCircleError(message)
        }

        setLoadingCircles(false)
        setLoadingJoinedCircles(false)

        const allCircles = [
          ...createdCircles,
          ...joined,
        ]

        const uniqueCircles = Array.from(
          new Map(
            allCircles.map((circle) => [
              circle.id,
              circle,
            ]),
          ).values(),
        )

        await loadCircleProgress(
          uniqueCircles,
        )
      } finally {
        setLoadingCircles(false)
        setLoadingJoinedCircles(false)
      }
    },
    [
      address,
      loadCircleProgress,
    ],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshCircles()
  }, [refreshCircles])

  const createCircle = useCallback(
    async (
      data: CreateCircleData,
    ): Promise<Circle> => {
      setCreatingCircle(true)
      setCircleError(null)

      try {
        const normalizedCreatorWallet =
          normalizeWalletAddress(address)

        const normalizedGoalOwnerWallet =
          normalizeWalletAddress(
            data.goalOwnerWallet,
          )

        const isPersonalGoal =
          normalizedCreatorWallet.toLowerCase() ===
          normalizedGoalOwnerWallet.toLowerCase()

        const goalOwnerUserId =
          isPersonalGoal
            ? user.id
            : data.goalOwnerUserId ?? null

        const createdCircle =
          await apiCreateCircle({
            name: data.name,
            description: data.description,
            targetAmount: data.targetAmount,
            deadline: data.deadline,
            creatorWallet:
              normalizedCreatorWallet,
            creatorUserId: user.id,
            goalOwnerWallet:
              normalizedGoalOwnerWallet,
            goalOwnerUserId,
            creatorCommitment:
              data.creatorCommitment,
          })

        setCircles((current) => [
          createdCircle,
          ...current,
        ])

        setCircleProgress((current) => ({
          ...current,
          [createdCircle.id]: {
            raisedAmount: 0,
            targetAmount:
              createdCircle.targetAmount,
            remainingAmount:
              createdCircle.targetAmount,
            progressPercentage: 0,
            contributorCount: 0,
          },
        }))

        return createdCircle
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(error)

        setCircleError(message)

        throw error
      } finally {
        setCreatingCircle(false)
      }
    },
    [address, user.id],
  )

  return {
    circles,
    joinedCircles,
    circleProgress,
    loadingCircles,
    loadingJoinedCircles,
    circleError,
    joinedCircleError,
    creatingCircle,
    createCircle,
    refreshCircles,
  }
}