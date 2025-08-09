import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-5 pt-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Bienvenido, {user?.username} </h1>
        <p className="lead text-muted">Rol: <strong>{user?.role}</strong></p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow rounded-4 p-4 text-center">
            <h5>Solicitudes</h5>
            <p>Revisa, crea o gestiona solicitudes.</p>
          </div>
        </div>
        {user?.role === 'admin' && (
          <>
            <div className="col-md-4">
              <div className="card border-0 shadow rounded-4 p-4 text-center">
                <h5>Usuarios</h5>
                <p>Administra cuentas y permisos.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow rounded-4 p-4 text-center">
                <h5>Empleados</h5>
                <p>Consulta y edita empleados.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
