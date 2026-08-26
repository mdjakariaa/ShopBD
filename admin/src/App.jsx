import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AddItems from './pages/AddItems'
import ListItems from './pages/ListItems'
import Orders from './pages/Orders'
import Login from './pages/Login'
import { useState } from 'react'

function App() {
  const [token, setToken] = useState("");
  return (
    <div className="App">
      {token === "" 
      ? 
        <Login />
      : <>
      <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<AddItems />} />
            <Route path="/list" element={<ListItems />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/add" replace />} />
          </Route>
        </Routes>
      </>
      }
    </div>
  );
}

export default App
