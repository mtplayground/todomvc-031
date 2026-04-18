import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { Todo } from '../types'
import { loadTodos, saveTodos } from './storage'
import { todosReducer } from './todosReducer'

export interface TodosContextValue {
  todos: Todo[]
  addTodo: (title: string) => void
  toggleTodo: (id: string) => void
  toggleAllTodos: () => void
  editTodo: (id: string, title: string) => void
  removeTodo: (id: string) => void
  clearCompleted: () => void
}

export const TodosContext = createContext<TodosContextValue | undefined>(
  undefined
)

interface TodosProviderProps {
  children: ReactNode
}

const createTodoId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const TodosProvider = ({ children }: TodosProviderProps) => {
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = useCallback((title: string) => {
    dispatch({
      type: 'add',
      payload: {
        id: createTodoId(),
        title,
      },
    })
  }, [])

  const toggleTodo = useCallback((id: string) => {
    dispatch({
      type: 'toggle',
      payload: { id },
    })
  }, [])

  const toggleAllTodos = useCallback(() => {
    dispatch({ type: 'toggleAll' })
  }, [])

  const editTodo = useCallback((id: string, title: string) => {
    dispatch({
      type: 'edit',
      payload: { id, title },
    })
  }, [])

  const removeTodo = useCallback((id: string) => {
    dispatch({
      type: 'remove',
      payload: { id },
    })
  }, [])

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'clearCompleted' })
  }, [])

  const value = useMemo(
    () => ({
      todos,
      addTodo,
      toggleTodo,
      toggleAllTodos,
      editTodo,
      removeTodo,
      clearCompleted,
    }),
    [todos, addTodo, toggleTodo, toggleAllTodos, editTodo, removeTodo, clearCompleted]
  )

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}
