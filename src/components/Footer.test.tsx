import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Todo } from '../types'
import { Footer } from './Footer'

const useTodosMock = vi.hoisted(() => vi.fn())

vi.mock('../state/useTodos', () => ({
  useTodos: useTodosMock,
}))

const createTodo = (overrides: Partial<Todo>): Todo => ({
  id: 'todo-id',
  title: 'Todo title',
  completed: false,
  ...overrides,
})

describe('Footer', () => {
  const clearCompleted = vi.fn()

  beforeEach(() => {
    clearCompleted.mockReset()
    useTodosMock.mockReturnValue({
      todos: [],
      clearCompleted,
    })
  })

  it('is hidden when todo list is empty', () => {
    render(<Footer />)

    expect(screen.queryByTestId('footer-section')).not.toBeInTheDocument()
  })

  it('shows singular item-left text when one active todo remains', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', completed: false }),
        createTodo({ id: '2', completed: true }),
      ],
      clearCompleted,
    })

    render(<Footer />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(/item left/i)).toBeInTheDocument()
  })

  it('shows plural items-left text when active count is not one', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', completed: false }),
        createTodo({ id: '2', completed: false }),
      ],
      clearCompleted,
    })

    render(<Footer />)

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/items left/i)).toBeInTheDocument()
  })

  it('renders filter links and highlights the active one', () => {
    useTodosMock.mockReturnValue({
      todos: [createTodo({ id: '1', completed: false })],
      clearCompleted,
    })

    render(<Footer filter="active" />)

    const allLink = screen.getByRole('link', { name: 'All' })
    const activeLink = screen.getByRole('link', { name: 'Active' })
    const completedLink = screen.getByRole('link', { name: 'Completed' })

    expect(allLink).toHaveAttribute('href', '#/')
    expect(activeLink).toHaveAttribute('href', '#/active')
    expect(completedLink).toHaveAttribute('href', '#/completed')

    expect(activeLink).toHaveClass('selected')
    expect(allLink).not.toHaveClass('selected')
    expect(completedLink).not.toHaveClass('selected')
  })

  it('shows clear-completed button only when there are completed todos', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', completed: false }),
        createTodo({ id: '2', completed: true }),
      ],
      clearCompleted,
    })

    render(<Footer />)

    expect(
      screen.getByRole('button', { name: /clear completed/i })
    ).toBeInTheDocument()
  })

  it('hides clear-completed button when there are no completed todos', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', completed: false }),
        createTodo({ id: '2', completed: false }),
      ],
      clearCompleted,
    })

    render(<Footer />)

    expect(
      screen.queryByRole('button', { name: /clear completed/i })
    ).not.toBeInTheDocument()
  })

  it('calls clearCompleted when clear-completed button is clicked', () => {
    useTodosMock.mockReturnValue({
      todos: [
        createTodo({ id: '1', completed: false }),
        createTodo({ id: '2', completed: true }),
      ],
      clearCompleted,
    })

    render(<Footer />)
    fireEvent.click(screen.getByRole('button', { name: /clear completed/i }))

    expect(clearCompleted).toHaveBeenCalledTimes(1)
  })
})
