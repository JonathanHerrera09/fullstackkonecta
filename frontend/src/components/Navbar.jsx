import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { token, logout, user } = useContext(AuthContext);

  if (!token) return null;

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-lg rounded-pill position-fixed start-50 translate-middle-x px-4 py-2" style={{ top: '20px', zIndex: 1000, width: '90%' }}>
      <div className="container-fluid justify-content-between">
        <span className="navbar-brand fw-bold">Mi App</span>
        <ul className="navbar-nav flex-row gap-3">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/solicitudes" className="nav-link">Solicitudes</Link>
          </li>
          {user?.role === 'admin' && (
            <>
              <li className="nav-item">
                <Link to="/empleados" className="nav-link">Empleados</Link>
              </li>
              <li className="nav-item">
                <Link to="/usuarios" className="nav-link">Usuarios</Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <button onClick={logout} className="btn btn-outline-danger btn-sm">Salir</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
