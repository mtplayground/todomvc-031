import { useState } from 'react'
import { useTodos } from '../state/useTodos'

export const Header = () => {
  const { addTodo } = useTodos()
  const [newTodoTitle, setNewTodoTitle] = useState('')

  const submit = () => {
    const title = newTodoTitle.trim()

    if (!title) {
      return
    }

    addTodo(title)
    setNewTodoTitle('')
  }

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        autoFocus
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(event) => setNewTodoTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            submit()
          }
        }}
      />
    </header>
  )
}
