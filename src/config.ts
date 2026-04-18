type EnvKey = 'VITE_APP_TITLE' | 'VITE_STORAGE_KEY'

const DEFAULTS: Record<EnvKey, string> = {
  VITE_APP_TITLE: 'TodoMVC 031',
  VITE_STORAGE_KEY: 'todomvc-031.todos',
}

const readEnv = (key: EnvKey): string => {
  const raw = import.meta.env[key]

  if (typeof raw !== 'string') {
    return DEFAULTS[key]
  }

  const value = raw.trim()
  return value.length > 0 ? value : DEFAULTS[key]
}

export const config = Object.freeze({
  appTitle: readEnv('VITE_APP_TITLE'),
  storageKey: readEnv('VITE_STORAGE_KEY'),
})
