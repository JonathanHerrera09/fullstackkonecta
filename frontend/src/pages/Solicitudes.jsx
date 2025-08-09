import { showConfirm, showSuccess, showError } from '../utils/alerts';
import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Solicitudes() {
  const { token, user } = useContext(AuthContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [form, setForm] = useState({ description: '', resumen: '', codigo: '' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const observer = useRef();

  const isAdmin = user?.role === 'admin';
  const api = axios.create({
    baseURL: 'http://localhost:4000/api/requests',
    headers: { Authorization: `Bearer ${token}` },
  });
  useEffect(() => {
    if (isAdmin) {
      axios.get('http://localhost:4000/api/employees/list', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setEmployeeList(res.data))
      .catch(() => showError("Error", "No se pudieron cargar los empleados"));
    }
  }, [isAdmin, token]);

  const loadSolicitudes = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await api.get(`/?page=${page}&limit=5&search=${search}`);
      const newData = res.data.data;
      setSolicitudes(prev => page === 1 ? newData : [...prev, ...newData]);
      setHasMore(newData.length === 5);
    } catch {
      setError('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  }, [page, search, loading, hasMore]);

  useEffect(() => {
    setPage(1);
    setSolicitudes([]);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    if (user) loadSolicitudes();
  }, [loadSolicitudes, user]);

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

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const newData = {
        ...form,
        employeeId: isAdmin ? selectedEmployeeId : user.employeeId
      };
      await api.post('/', newData);
      setForm({ description: '', resumen: '', codigo: '' });
      setPage(1);
      setSolicitudes([]);
      setHasMore(true);
    } catch {
      setError('Error al enviar solicitud');
    }
  };

  const handleEstado = async (id, status) => {
    const result = await showConfirm('¿Estás seguro de cambiar el estado de esta solicitud?');
    if (!result.isConfirmed) return;

    try {
      await api.put(`/${id}`, { status });
      setPage(1);
      setSolicitudes([]);
      setHasMore(true);
      showSuccess('Estado actualizado', 'La solicitud ha sido actualizada.');
    } catch (err) {
      showError('Error', 'No se pudo actualizar la solicitud.');
    }
  };
  const handleDelete = async id => {
    if (confirm('¿Eliminar esta solicitud?')) {
      await api.delete(`/${id}`);
      setPage(1);
      setSolicitudes([]);
      setHasMore(true);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="card p-4 shadow-sm rounded-4">
        <h2 className="mb-4">Solicitudes</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Buscar por descripción..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
          <form onSubmit={handleSubmit} className="row g-3 mb-4">
            {isAdmin && (
          <div className="col-md-3">
            <select
              className="form-select shadow-sm"
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
              required
            >
              <option value="">Seleccione empleado</option>
              {employeeList.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        )}
            <div className="col-md-3">
              <input type="text" name="codigo" className="form-control shadow-sm" placeholder="Código" value={form.codigo} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <input type="text" name="description" className="form-control shadow-sm" placeholder="Descripción" value={form.description} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <input type="text" name="resumen" className="form-control shadow-sm" placeholder="Resumen" value={form.resumen} onChange={handleChange} required />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100 shadow">Enviar</button>
            </div>
          </form>

        <div className="table-responsive rounded-4">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Empleado</th>
                <th>Código</th>
                <th>Descripción</th>
                <th>Resumen</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s, i) => (
                <tr key={s.id} ref={i === solicitudes.length - 1 ? lastElementRef : null}>
                  <td>{s.Employee?.name || 'Sin nombre'}</td>
                  <td>{s.codigo}</td>
                  <td>{s.description}</td>
                  <td>{s.resumen}</td>
                  <td>
                    {isAdmin ? (
                      <select
                        value={s.status}
                        className="form-select form-select-sm"
                        onChange={e => handleEstado(s.id, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="approved">Aprobada</option>
                        <option value="rejected">Rechazada</option>
                      </select>
                    ) : (
                      <span className={`badge bg-${{
                        pending: 'secondary',
                        approved: 'success',
                        rejected: 'danger'
                      }[s.status]}`}>{s.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && <div className="text-center my-3">Cargando...</div>}
        {!hasMore && solicitudes.length > 0 && <div className="text-center my-3 text-muted">No hay más resultados</div>}
      </div>
    </div>
  );
}
