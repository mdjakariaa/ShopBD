import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AddItems from './pages/AddItems'
import ListItems from './pages/ListItems'
import Orders from './pages/Orders'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/add" replace />} />
        <Route path="/add" element={<AddItems />} />
        <Route path="/list" element={<ListItems />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<Navigate to="/add" replace />} />
      </Route>
    </Routes>
  )
}

export default App
