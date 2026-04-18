import { useTodos } from '../state/useTodos'
import type { Filter } from '../types'

interface FooterProps {
  filter?: Filter
}

const FILTER_LINKS: Array<{ label: string; filter: Filter; href: string }> = [
  { label: 'All', filter: 'all', href: '#/' },
  { label: 'Active', filter: 'active', href: '#/active' },
  { label: 'Completed', filter: 'completed', href: '#/completed' },
]

export const Footer = ({ filter = 'all' }: FooterProps) => {
  const { todos, clearCompleted } = useTodos()

  if (todos.length === 0) {
    return null
  }

  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - activeCount
  const itemLabel = activeCount === 1 ? 'item' : 'items'

  return (
    <footer className="footer" data-testid="footer-section">
      <span className="todo-count">
        <strong>{activeCount}</strong> {itemLabel} left
      </span>

      <ul className="filters">
        {FILTER_LINKS.map((link) => (
          <li key={link.filter}>
            <a
              href={link.href}
              className={filter === link.filter ? 'selected' : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {completedCount > 0 ? (
        <button className="clear-completed" onClick={clearCompleted}>
          Clear completed
        </button>
      ) : null}
    </footer>
  )
}
