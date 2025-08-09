import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Empleados from './pages/Empleados';
import Solicitudes from './pages/Solicitudes';
import Usuarios from './pages/Usuarios';

function App() {
  const { token, user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/usuarios" element={token && user?.role === 'admin' ? <Usuarios /> : <Navigate to="/dashboard" />} />
        <Route path="/solicitudes" element={token ? <Solicitudes /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        <Route path="/empleados" element={token && user?.role === 'admin' ? <Empleados /> : <Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
