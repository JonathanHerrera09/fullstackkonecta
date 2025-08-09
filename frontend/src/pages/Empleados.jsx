import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Empleados() {
  const { token, user } = useContext(AuthContext);
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const api = axios.create({
    baseURL: 'http://localhost:4000/api/employees',
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchEmpleados = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await api.get(`/?page=${page}&limit=5&search=${search}`);
      const newData = res.data.data;
      setEmpleados(prev => page === 1 ? newData : [...prev, ...newData]);
      setHasMore(newData.length === 5);
    } catch {
      setError('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  }, [api, page, search, hasMore, loading]);

  useEffect(() => {
    setPage(1);
    setEmpleados([]);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const lastElementRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="container mt-5 pt-5">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="mb-4">Lista de Empleados</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <input
          type="text"
          className="form-control mb-4"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Salario</th>
                <th>Fecha Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp, i) => (
                <tr key={emp.id} ref={i === empleados.length - 1 ? lastElementRef : null}>
                  <td>{emp.name}</td>
                  <td>${parseFloat(emp.salary).toLocaleString()}</td>
                  <td>{new Date(emp.hireDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && <div className="text-center my-3">Cargando...</div>}
        {!hasMore && empleados.length > 0 && (
          <div className="text-center my-3 text-muted">No hay más empleados</div>
        )}
      </div>
    </div>
  );
}
