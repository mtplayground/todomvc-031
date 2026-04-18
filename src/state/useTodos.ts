import { useContext } from 'react'
import { TodosContext } from './TodosContext'

export const useTodos = () => {
  const context = useContext(TodosContext)

  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider')
  }

  return context
}
