import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.location.hash = '#/'
  })

  it('renders TodoMVC root layout with header and info footer', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'todos' })).toBeInTheDocument()
    expect(screen.getByText(/double-click to edit a todo/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /todomvc/i })).toBeInTheDocument()
  })
})
