import type { Todo } from '../types'

export type TodosAction =
  | { type: 'add'; payload: { id: string; title: string } }
  | { type: 'toggle'; payload: { id: string } }
  | { type: 'toggleAll' }
  | { type: 'edit'; payload: { id: string; title: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'clearCompleted' }

export const todosReducer = (state: Todo[], action: TodosAction): Todo[] => {
  switch (action.type) {
    case 'add': {
      const title = action.payload.title.trim()

      if (!title) {
        return state
      }

      return [
        ...state,
        {
          id: action.payload.id,
          title,
          completed: false,
        },
      ]
    }

    case 'toggle': {
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    }

    case 'toggleAll': {
      const shouldCompleteAll = state.some((todo) => !todo.completed)
      return state.map((todo) => ({ ...todo, completed: shouldCompleteAll }))
    }

    case 'edit': {
      const title = action.payload.title.trim()

      if (!title) {
        return state.filter((todo) => todo.id !== action.payload.id)
      }

      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, title } : todo
      )
    }

    case 'remove': {
      return state.filter((todo) => todo.id !== action.payload.id)
    }

    case 'clearCompleted': {
      return state.filter((todo) => !todo.completed)
    }

    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}
