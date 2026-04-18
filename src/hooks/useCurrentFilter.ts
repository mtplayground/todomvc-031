import { useLocation } from 'react-router-dom'
import type { Filter } from '../types'

const PATH_TO_FILTER: Record<string, Filter> = {
  '/': 'all',
  '/active': 'active',
  '/completed': 'completed',
}

export const useCurrentFilter = (): Filter => {
  const { pathname } = useLocation()

  return PATH_TO_FILTER[pathname] ?? 'all'
}
