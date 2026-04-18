import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Header } from './Header'

const useTodosMock = vi.hoisted(() => vi.fn())

vi.mock('../state/useTodos', () => ({
  useTodos: useTodosMock,
}))

describe('Header', () => {
  const addTodo = vi.fn()

  beforeEach(() => {
    addTodo.mockReset()
    useTodosMock.mockReturnValue({
      addTodo,
    })
  })

  it('renders the new-todo input', () => {
    render(<Header />)

    expect(screen.getByPlaceholderText(/what needs to be done\?/i)).toBeInTheDocument()
  })

  it('updates input as a controlled field', () => {
    render(<Header />)

    const input = screen.getByPlaceholderText(/what needs to be done\?/i)
    fireEvent.change(input, { target: { value: 'Buy milk' } })

    expect(input).toHaveValue('Buy milk')
  })

  it('submits trimmed value on Enter and resets input', () => {
    render(<Header />)

    const input = screen.getByPlaceholderText(/what needs to be done\?/i)
    fireEvent.change(input, { target: { value: '  Buy milk  ' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(addTodo).toHaveBeenCalledTimes(1)
    expect(addTodo).toHaveBeenCalledWith('Buy milk')
    expect(input).toHaveValue('')
  })

  it('ignores Enter when trimmed value is empty', () => {
    render(<Header />)

    const input = screen.getByPlaceholderText(/what needs to be done\?/i)
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(addTodo).not.toHaveBeenCalled()
    expect(input).toHaveValue('   ')
  })
})
