import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Main } from './components/Main'
import { useCurrentFilter } from './hooks/useCurrentFilter'

const TodoPage = () => {
  const filter = useCurrentFilter()

  return (
    <>
      <Header />
      <Main filter={filter} />
      <Footer filter={filter} />
    </>
  )
}

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/active" element={<TodoPage />} />
        <Route path="/completed" element={<TodoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
