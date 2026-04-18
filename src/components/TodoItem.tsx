import { useEffect, useRef, useState } from 'react'
import { useTodos } from '../state/useTodos'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const { toggleTodo, editTodo, removeTodo } = useTodos()
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(todo.title)
  const skipBlurCommitRef = useRef(false)
  const editInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isEditing || !editInputRef.current) {
      return
    }

    const input = editInputRef.current
    input.focus()

    const cursorPosition = input.value.length
    input.setSelectionRange(cursorPosition, cursorPosition)
  }, [isEditing])

  const startEditing = () => {
    setDraftTitle(todo.title)
    setIsEditing(true)
  }

  const finishEditing = () => {
    const title = draftTitle.trim()

    if (!title) {
      removeTodo(todo.id)
    } else {
      editTodo(todo.id, title)
    }

    setIsEditing(false)
  }

  const cancelEditing = () => {
    skipBlurCommitRef.current = true
    setDraftTitle(todo.title)
    setIsEditing(false)
  }

  const itemClassName = [
    todo.completed ? 'completed' : '',
    isEditing ? 'editing' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={itemClassName} data-testid="todo-item">
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          aria-label={`Toggle ${todo.title}`}
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <label onDoubleClick={startEditing}>{todo.title}</label>
        <button
          className="destroy"
          aria-label={`Delete ${todo.title}`}
          onClick={() => removeTodo(todo.id)}
        ></button>
      </div>

      {isEditing ? (
        <input
          ref={editInputRef}
          className="edit"
          aria-label={`Edit ${todo.title}`}
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          onBlur={() => {
            if (skipBlurCommitRef.current) {
              skipBlurCommitRef.current = false
              return
            }

            finishEditing()
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              finishEditing()
            }

            if (event.key === 'Escape') {
              cancelEditing()
            }
          }}
          autoFocus
        />
      ) : null}
    </li>
  )
}
