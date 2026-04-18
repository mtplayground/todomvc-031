import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Todo } from '../types'
import { TodoItem } from './TodoItem'

const useTodosMock = vi.hoisted(() => vi.fn())

vi.mock('../state/useTodos', () => ({
  useTodos: useTodosMock,
}))

const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 'todo-1',
  title: 'Buy milk',
  completed: false,
  ...overrides,
})

describe('TodoItem', () => {
  const toggleTodo = vi.fn()
  const editTodo = vi.fn()
  const removeTodo = vi.fn()

  beforeEach(() => {
    toggleTodo.mockReset()
    editTodo.mockReset()
    removeTodo.mockReset()

    useTodosMock.mockReturnValue({
      toggleTodo,
      editTodo,
      removeTodo,
    })
  })

  it('renders checkbox, label, and destroy button in view mode', () => {
    render(<TodoItem todo={createTodo()} />)

    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(document.querySelector('button.destroy')).toBeInTheDocument()
  })

  it('applies completed class when todo is completed', () => {
    render(<TodoItem todo={createTodo({ completed: true })} />)

    expect(screen.getByTestId('todo-item')).toHaveClass('completed')
  })

  it('toggles todo when checkbox changes', () => {
    render(<TodoItem todo={createTodo()} />)

    fireEvent.click(screen.getByRole('checkbox'))

    expect(toggleTodo).toHaveBeenCalledWith('todo-1')
  })

  it('removes todo when destroy is clicked', () => {
    render(<TodoItem todo={createTodo()} />)

    const destroy = document.querySelector('button.destroy')
    expect(destroy).not.toBeNull()
    fireEvent.click(destroy!)

    expect(removeTodo).toHaveBeenCalledWith('todo-1')
  })

  it('enters editing mode on label double-click', () => {
    render(<TodoItem todo={createTodo()} />)

    fireEvent.doubleClick(screen.getByText('Buy milk'))

    const item = screen.getByTestId('todo-item')
    expect(item).toHaveClass('editing')
    expect(document.querySelector('input.edit')).toBeInTheDocument()
  })

  it('commits edit on Enter with trimmed value', () => {
    render(<TodoItem todo={createTodo()} />)

    fireEvent.doubleClick(screen.getByText('Buy milk'))
    const editInput = document.querySelector('input.edit') as HTMLInputElement

    fireEvent.change(editInput, { target: { value: '  Updated title  ' } })
    fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' })

    expect(editTodo).toHaveBeenCalledWith('todo-1', 'Updated title')
    expect(screen.getByTestId('todo-item')).not.toHaveClass('editing')
  })

  it('commits edit on blur with trimmed value', () => {
    render(<TodoItem todo={createTodo()} />)

    fireEvent.doubleClick(screen.getByText('Buy milk'))
    const editInput = document.querySelector('input.edit') as HTMLInputElement

    fireEvent.change(editInput, { target: { value: '  Updated on blur  ' } })
    fireEvent.blur(editInput)

    expect(editTodo).toHaveBeenCalledWith('todo-1', 'Updated on blur')
    expect(screen.getByTestId('todo-item')).not.toHaveClass('editing')
  })

  it('cancels edit on Escape without persisting changes', () => {
    render(<TodoItem todo={createTodo()} />)

    fireEvent.doubleClick(screen.getByText('Buy milk'))
    const editInput = document.querySelector('input.edit') as HTMLInputElement

    fireEvent.change(editInput, { target: { value: 'Should not persist' } })
    fireEvent.keyDown(editInput, { key: 'Escape', code: 'Escape' })
    fireEvent.blur(editInput)

    expect(editTodo).not.toHaveBeenCalled()
    expect(removeTodo).not.toHaveBeenCalled()
    expect(screen.getByTestId('todo-item')).not.toHaveClass('editing')
  })

  it('deletes todo when committing an empty edited title', () => {
    render(<TodoItem todo={createTodo()} />)

    fireEvent.doubleClick(screen.getByText('Buy milk'))
    const editInput = document.querySelector('input.edit') as HTMLInputElement

    fireEvent.change(editInput, { target: { value: '   ' } })
    fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' })

    expect(removeTodo).toHaveBeenCalledWith('todo-1')
    expect(editTodo).not.toHaveBeenCalled()
  })
})
