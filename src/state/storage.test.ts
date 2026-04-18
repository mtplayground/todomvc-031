import { beforeEach, describe, expect, it, vi } from 'vitest'
import { config } from '../config'
import type { Todo } from '../types'
import { loadTodos, saveTodos } from './storage'

const sampleTodos: Todo[] = [
  { id: '1', title: 'First', completed: false },
  { id: '2', title: 'Second', completed: true },
]

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('loads todos from localStorage when payload is valid', () => {
    window.localStorage.setItem(config.storageKey, JSON.stringify(sampleTodos))

    expect(loadTodos()).toEqual(sampleTodos)
  })

  it('returns an empty list when key is missing', () => {
    expect(loadTodos()).toEqual([])
  })

  it('returns an empty list when JSON is invalid', () => {
    window.localStorage.setItem(config.storageKey, '{bad json')

    expect(loadTodos()).toEqual([])
  })

  it('returns an empty list when parsed value is not an array', () => {
    window.localStorage.setItem(config.storageKey, JSON.stringify({ foo: 'bar' }))

    expect(loadTodos()).toEqual([])
  })

  it('returns an empty list when parsed array includes invalid todo items', () => {
    window.localStorage.setItem(
      config.storageKey,
      JSON.stringify([
        { id: '1', title: 'ok', completed: false },
        { id: 2, title: 'invalid', completed: true },
      ])
    )

    expect(loadTodos()).toEqual([])
  })

  it('saves todos to localStorage under the configured key', () => {
    saveTodos(sampleTodos)

    expect(window.localStorage.getItem(config.storageKey)).toBe(
      JSON.stringify(sampleTodos)
    )
  })

  it('does not throw when localStorage.setItem fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => saveTodos(sampleTodos)).not.toThrow()
  })
})
