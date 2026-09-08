import type { Circle } from '../types/circle'

const CIRCLE_STORAGE_PREFIX = 'nimcircle:circles:'

function getStorageKey(address: string) {
  return `${CIRCLE_STORAGE_PREFIX}${address.toLowerCase()}`
}

export function saveCircles(
  address: string,
  circles: Circle[],
) {
  localStorage.setItem(
    getStorageKey(address),
    JSON.stringify(circles),
  )
}

export function loadCircles(
  address: string,
): Circle[] {
  const stored = localStorage.getItem(
    getStorageKey(address),
  )

  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed as Circle[]
  } catch {
    localStorage.removeItem(getStorageKey(address))
    return []
  }
}

export function addCircle(
  address: string,
  circle: Circle,
) {
  const circles = loadCircles(address)

  saveCircles(address, [...circles, circle])
}

export function clearCircles(address: string) {
  localStorage.removeItem(getStorageKey(address))
}