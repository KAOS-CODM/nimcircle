import type { Circle } from '../types/circle'

const CIRCLE_STORAGE_KEY = 'nimcircle:circle'

export function saveCircle(circle: Circle) {
  localStorage.setItem(CIRCLE_STORAGE_KEY, JSON.stringify(circle))
}

export function loadCircle(): Circle | null {
  const stored = localStorage.getItem(CIRCLE_STORAGE_KEY)

  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as Circle
  } catch {
    localStorage.removeItem(CIRCLE_STORAGE_KEY)
    return null
  }
}

export function clearCircle() {
  localStorage.removeItem(CIRCLE_STORAGE_KEY)
}