import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Main } from './components/Main'
import { useCurrentFilter } from './hooks/useCurrentFilter'
import { TodosProvider } from './state/TodosContext'

const TodoAppLayout = () => {
  const filter = useCurrentFilter()

  return (
    <>
      <section className="todoapp">
        <Header />
        <Main filter={filter} />
        <Footer filter={filter} />
      </section>

      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="https://github.com/mtplayground">mtplayground</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  )
}

const App = () => {
  return (
    <TodosProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TodoAppLayout />} />
          <Route path="/active" element={<TodoAppLayout />} />
          <Route path="/completed" element={<TodoAppLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </TodosProvider>
  )
}

export default App
