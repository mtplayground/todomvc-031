import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Todo } from '../types'
import { Main } from './Main'

const useTodosMock = vi.hoisted(() => vi.fn())

vi.mock('../state/useTodos', () => ({
  useTodos: useTodosMock,
}))

vi.mock('./TodoItem', () => ({
  TodoItem: ({ todo }: { todo: Todo }) => <li data-testid="todo-item">{todo.title}</li>,
}))

const createTodo = (overrides: Partial<Todo>): Todo => ({
  id: 'todo-id',
  title: 'Todo title',
  completed: false,
  ...overrides,
})

describe('Main', () => {
  const toggleAllTodos = vi.fn()

  beforeEach(() => {
    toggleAllTodos.mockReset()
    useTodosMock.mockReturnValue({
      todos: [],
      toggleAllTodos,
    })
  })

  it('is hidden when todo list is empty', () => {
    render(<Main />)

    expect(screen.queryByTestId('main-section')).not.toBeInTheDocument()
  })

  it('renders all todos for all filter', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', title: 'Active', completed: false }),
        createTodo({ id: '2', title: 'Completed', completed: true }),
      ],
      toggleAllTodos,
    })

    render(<Main filter="all" />)

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders only active todos for active filter', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', title: 'Active', completed: false }),
        createTodo({ id: '2', title: 'Completed', completed: true }),
      ],
      toggleAllTodos,
    })

    render(<Main filter="active" />)

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.queryByText('Completed')).not.toBeInTheDocument()
  })

  it('renders only completed todos for completed filter', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', title: 'Active', completed: false }),
        createTodo({ id: '2', title: 'Completed', completed: true }),
      ],
      toggleAllTodos,
    })

    render(<Main filter="completed" />)

    expect(screen.queryByText('Active')).not.toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('checks toggle-all when all todos are completed', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', completed: true }),
        createTodo({ id: '2', completed: true }),
      ],
      toggleAllTodos,
    })

    render(<Main />)

    expect(screen.getByLabelText('Mark all as complete')).toBeChecked()
  })

  it('unchecks toggle-all when not all todos are completed', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', completed: true }),
        createTodo({ id: '2', completed: false }),
      ],
      toggleAllTodos,
    })

    render(<Main />)

    expect(screen.getByLabelText('Mark all as complete')).not.toBeChecked()
  })

  it('toggles all todos when toggle-all is clicked', () => {
    useTodosMock.mockReturnValue({
      todos: [createTodo({ id: '1', completed: false })],
      toggleAllTodos,
    })

    render(<Main />)

    fireEvent.click(screen.getByLabelText('Mark all as complete'))

    expect(toggleAllTodos).toHaveBeenCalledTimes(1)
  })
})
