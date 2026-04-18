import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

const getNewTodoInput = (): HTMLInputElement =>
  screen.getByPlaceholderText(/what needs to be done\?/i) as HTMLInputElement

const addTodo = (title: string) => {
  const input = getNewTodoInput()
  fireEvent.change(input, { target: { value: title } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
}

const getTodoItem = (title: string): HTMLLIElement => {
  const list = document.querySelector('ul.todo-list')

  if (!list) {
    throw new Error('Todo list not found')
  }

  const item = Array.from(list.querySelectorAll('li')).find((candidate) => {
    const label = candidate.querySelector('label')
    return label?.textContent === title
  })

  if (!item) {
    throw new Error(`Todo item not found for title: ${title}`)
  }

  return item as HTMLLIElement
}

const hasTodoInList = (title: string): boolean => {
  const list = document.querySelector('ul.todo-list')

  if (!list) {
    return false
  }

  return Array.from(list.querySelectorAll('li label')).some(
    (label) => label.textContent === title
  )
}

const toggleTodo = (title: string) => {
  const item = getTodoItem(title)
  fireEvent.click(within(item).getByRole('checkbox'))
}

const destroyTodo = (title: string) => {
  const item = getTodoItem(title)
  const destroy = item.querySelector('button.destroy')

  if (!destroy) {
    throw new Error(`Destroy button not found for: ${title}`)
  }

  fireEvent.click(destroy)
}

const startEditingTodo = (title: string): HTMLInputElement => {
  const item = getTodoItem(title)
  const label = item.querySelector('label')

  if (!label) {
    throw new Error(`Todo label not found for: ${title}`)
  }

  fireEvent.doubleClick(label)
  const input = document.querySelector('input.edit') as HTMLInputElement | null

  if (!input) {
    throw new Error(`Edit input not found for: ${title}`)
  }

  return input
}

const navigateTo = (path: '/' | '/active' | '/completed') => {
  window.location.hash = `#${path}`
  fireEvent(window, new HashChangeEvent('hashchange'))
}

describe('TodoMVC integration', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.location.hash = '#/'
  })

  it('adds todos and ignores empty submissions', () => {
    render(<App />)

    addTodo('Buy milk')

    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(getNewTodoInput()).toHaveValue('')

    addTodo('   ')

    expect(screen.getAllByTestId('todo-item')).toHaveLength(1)
  })

  it('toggles single todos and toggle-all in both directions', () => {
    render(<App />)

    addTodo('One')
    addTodo('Two')

    toggleTodo('One')
    expect(getTodoItem('One')).toHaveClass('completed')
    expect(getTodoItem('Two')).not.toHaveClass('completed')

    const toggleAll = screen.getByLabelText('Mark all as complete')

    fireEvent.click(toggleAll)
    expect(getTodoItem('One')).toHaveClass('completed')
    expect(getTodoItem('Two')).toHaveClass('completed')

    fireEvent.click(toggleAll)
    expect(getTodoItem('One')).not.toHaveClass('completed')
    expect(getTodoItem('Two')).not.toHaveClass('completed')
  })

  it('edits todos by Enter and blur, Escape cancels, and empty commit deletes', () => {
    render(<App />)

    addTodo('Original')

    const editInputByEnter = startEditingTodo('Original')
    fireEvent.change(editInputByEnter, { target: { value: 'Edited with enter' } })
    fireEvent.keyDown(editInputByEnter, { key: 'Enter', code: 'Enter' })
    expect(screen.getByText('Edited with enter')).toBeInTheDocument()

    const editInputByBlur = startEditingTodo('Edited with enter')
    fireEvent.change(editInputByBlur, { target: { value: 'Edited on blur' } })
    fireEvent.blur(editInputByBlur)
    expect(screen.getByText('Edited on blur')).toBeInTheDocument()

    const editInputByEscape = startEditingTodo('Edited on blur')
    fireEvent.change(editInputByEscape, { target: { value: 'Should cancel' } })
    fireEvent.keyDown(editInputByEscape, { key: 'Escape', code: 'Escape' })
    expect(screen.getByText('Edited on blur')).toBeInTheDocument()
    expect(screen.queryByText('Should cancel')).not.toBeInTheDocument()

    const editInputDelete = startEditingTodo('Edited on blur')
    fireEvent.change(editInputDelete, { target: { value: '   ' } })
    fireEvent.keyDown(editInputDelete, { key: 'Enter', code: 'Enter' })
    expect(screen.queryByText('Edited on blur')).not.toBeInTheDocument()
  })

  it('deletes todos via destroy button', () => {
    render(<App />)

    addTodo('Delete me')
    destroyTodo('Delete me')

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
  })

  it('filters todos by all/active/completed routes', async () => {
    render(<App />)

    addTodo('Active todo')
    addTodo('Completed todo')
    toggleTodo('Completed todo')

    navigateTo('/active')
    await waitFor(() => {
      expect(hasTodoInList('Active todo')).toBe(true)
      expect(hasTodoInList('Completed todo')).toBe(false)
    })

    navigateTo('/completed')
    await waitFor(() => {
      expect(hasTodoInList('Active todo')).toBe(false)
      expect(hasTodoInList('Completed todo')).toBe(true)
    })

    navigateTo('/')
    await waitFor(() => {
      expect(hasTodoInList('Active todo')).toBe(true)
      expect(hasTodoInList('Completed todo')).toBe(true)
    })
  })

  it('clears completed todos and keeps active todos', () => {
    render(<App />)

    addTodo('Active')
    addTodo('Completed')
    toggleTodo('Completed')

    fireEvent.click(screen.getByRole('button', { name: /clear completed/i }))

    expect(getTodoItem('Active')).toBeInTheDocument()
    expect(hasTodoInList('Completed')).toBe(false)
  })

  it('renders counter pluralization correctly', () => {
    render(<App />)

    addTodo('Only one')
    expect(document.querySelector('.todo-count')?.textContent).toContain(
      '1 item left'
    )

    addTodo('Second item')
    expect(document.querySelector('.todo-count')?.textContent).toContain(
      '2 items left'
    )
  })

  it('persists todos across reload', () => {
    const firstRender = render(<App />)

    addTodo('Persisted todo')
    expect(screen.getByText('Persisted todo')).toBeInTheDocument()

    firstRender.unmount()

    render(<App />)

    expect(screen.getByText('Persisted todo')).toBeInTheDocument()
  })
})
