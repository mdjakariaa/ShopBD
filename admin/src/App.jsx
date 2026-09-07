import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AddItems from './pages/AddItems'
import ListItems from './pages/ListItems'
import Orders from './pages/Orders'
import Login from './pages/Login'
import { useState } from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from 'react';

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
export const currency = "$";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : "",
  );

  // Store the token in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="App">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <Routes>
          <Route element={<Layout setToken={setToken} />}>
            <Route index element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<AddItems token={token} />} />
            <Route path="/list" element={<ListItems token={token} />} />
            <Route path="/orders" element={<Orders token={token} />} />
            <Route path="*" element={<Navigate to="/add" replace />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}

export default App;
