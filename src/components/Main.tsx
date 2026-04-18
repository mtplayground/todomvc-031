import { TodoItem } from './TodoItem'
import { useTodos } from '../state/useTodos'
import type { Filter, Todo } from '../types'

interface MainProps {
  filter?: Filter
}

const filterTodos = (todos: Todo[], filter: Filter): Todo[] => {
  if (filter === 'active') {
    return todos.filter((todo) => !todo.completed)
  }

  if (filter === 'completed') {
    return todos.filter((todo) => todo.completed)
  }

  return todos
}

export const Main = ({ filter = 'all' }: MainProps) => {
  const { todos, toggleAllTodos } = useTodos()

  if (todos.length === 0) {
    return null
  }

  const visibleTodos = filterTodos(todos, filter)
  const allCompleted = todos.length > 0 && todos.every((todo) => todo.completed)

  return (
    <section className="main" data-testid="main-section">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        aria-label="Toggle all todos"
        checked={allCompleted}
        onChange={toggleAllTodos}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>

      <ul className="todo-list">
        {visibleTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  )
}
