import { config } from '../config'
import type { Todo } from '../types'

const isTodo = (value: unknown): value is Todo => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<Todo>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.completed === 'boolean'
  )
}

export const loadTodos = (): Todo[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(config.storageKey)

    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    if (!parsed.every(isTodo)) {
      return []
    }

    return parsed
  } catch {
    return []
  }
}

export const saveTodos = (todos: Todo[]): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.setItem(config.storageKey, JSON.stringify(todos))
  } catch {
    // Ignore storage write failures (e.g., private mode/quota exceeded).
  }
}
