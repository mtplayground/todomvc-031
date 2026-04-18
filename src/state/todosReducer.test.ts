import { describe, expect, it } from 'vitest'
import type { Todo } from '../types'
import { todosReducer } from './todosReducer'

const createState = (): Todo[] => [
  { id: '1', title: 'First', completed: false },
  { id: '2', title: 'Second', completed: true },
]

describe('todosReducer', () => {
  it('adds a new todo with trimmed title', () => {
    const state = createState()

    const result = todosReducer(state, {
      type: 'add',
      payload: { id: '3', title: '  New todo  ' },
    })

    expect(result).toEqual([
      ...state,
      { id: '3', title: 'New todo', completed: false },
    ])
  })

  it('ignores add when title is blank after trimming', () => {
    const state = createState()

    const result = todosReducer(state, {
      type: 'add',
      payload: { id: '3', title: '   ' },
    })

    expect(result).toBe(state)
  })

  it('toggles a single todo by id', () => {
    const state = createState()

    const result = todosReducer(state, {
      type: 'toggle',
      payload: { id: '1' },
    })

    expect(result).toEqual([
      { id: '1', title: 'First', completed: true },
      { id: '2', title: 'Second', completed: true },
    ])
  })

  it('toggleAll completes all when at least one is active', () => {
    const state = createState()

    const result = todosReducer(state, { type: 'toggleAll' })

    expect(result.every((todo) => todo.completed)).toBe(true)
  })

  it('toggleAll uncompletes all when all are completed', () => {
    const state: Todo[] = [
      { id: '1', title: 'First', completed: true },
      { id: '2', title: 'Second', completed: true },
    ]

    const result = todosReducer(state, { type: 'toggleAll' })

    expect(result.every((todo) => !todo.completed)).toBe(true)
  })

  it('edits a todo title and trims whitespace', () => {
    const state = createState()

    const result = todosReducer(state, {
      type: 'edit',
      payload: { id: '1', title: '  Updated  ' },
    })

    expect(result).toEqual([
      { id: '1', title: 'Updated', completed: false },
      { id: '2', title: 'Second', completed: true },
    ])
  })

  it('removes todo on edit when title is blank after trim', () => {
    const state = createState()

    const result = todosReducer(state, {
      type: 'edit',
      payload: { id: '1', title: '   ' },
    })

    expect(result).toEqual([{ id: '2', title: 'Second', completed: true }])
  })

  it('removes a todo by id', () => {
    const state = createState()

    const result = todosReducer(state, {
      type: 'remove',
      payload: { id: '2' },
    })

    expect(result).toEqual([{ id: '1', title: 'First', completed: false }])
  })

  it('clears completed todos', () => {
    const state = createState()

    const result = todosReducer(state, { type: 'clearCompleted' })

    expect(result).toEqual([{ id: '1', title: 'First', completed: false }])
  })

  it('does not mutate the original state', () => {
    const state = createState()
    const snapshot = structuredClone(state)

    todosReducer(state, {
      type: 'toggle',
      payload: { id: '1' },
    })

    expect(state).toEqual(snapshot)
  })
})
