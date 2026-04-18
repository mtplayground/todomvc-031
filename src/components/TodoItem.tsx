import { useRef, useState } from 'react'
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
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <label onDoubleClick={startEditing}>{todo.title}</label>
        <button className="destroy" onClick={() => removeTodo(todo.id)}></button>
      </div>

      {isEditing ? (
        <input
          className="edit"
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
