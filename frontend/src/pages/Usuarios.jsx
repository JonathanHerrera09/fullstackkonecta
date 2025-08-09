import { showError, showSuccess, showConfirm } from '../utils/alerts';
import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Usuarios() {
  const { token, user } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    password: ''
  });
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'employee',
    name: '',
    salary: '',
    hireDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const limit = 5;

  const api = axios.create({
    baseURL: 'http://localhost:4000/api/users',
    headers: { Authorization: `Bearer ${token}` },
  });

  const loadUsuarios = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await api.get(`?page=${page}&limit=${limit}&search=${search}`);
      const newData = res.data.data;
      setUsuarios(prev => page === 1 ? newData : [...prev, ...newData]);
      setHasMore(newData.length === limit);
    } catch {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [page, search, loading, hasMore]);

  useEffect(() => {
    setPage(1);
    setUsuarios([]);
    setHasMore(true);
  }, [search]);

  useEffect(() => {
    if (user) loadUsuarios();
  }, [loadUsuarios, user]);

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
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!editingId && form.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };
  const handleChange = e => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
  
  if (name === 'password' && !editingId) {
    setValidationErrors({
      ...validationErrors,
      password: value.length > 0 && value.length < 6 
        ? 'La contraseña debe tener al menos 6 caracteres' 
        : ''
    });
  }
};

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
    return;
  }
    try {
      if (editingId) {
        await api.put(`/${editingId}`, form);
      } else {
        await api.post('/', form);
      }
      setForm({
        username: '',
        password: '',
        role: 'employee',
        name: '',
        salary: '',
        hireDate: ''
      });
      setEditingId(null);
      setPage(1);
      setUsuarios([]);
      setHasMore(true);
    } catch {
      setError('Error al guardar usuario');
    }
  };

  const handleEdit = async (usuario) => {
  try {
    const res = await api.get(`/${usuario.id}`);
    const userData = res.data;
    // console.log('userData', userData);
    // debugger;
    setForm({
      username: userData.username,
      role: userData.role,
      name: userData?.Employee?.name || '',
      salary: userData?.Employee?.salary || '',
      hireDate: userData?.Employee?.hireDate?.slice(0, 10) || ''
    });

    setEditingId(userData.id);
  } catch (err) {
    showError('Error al cargar usuario', 'No se pudo obtener la información completa del usuario.');
  }
};


  const handleDelete = async id => {
  if (id === user.id) {
    return showError("Acción no permitida", "No puedes eliminarte a ti mismo");
  }

  const result = await showConfirm("¿Eliminar este usuario?");
  if (result.isConfirmed) {
    await api.delete(`/${id}`);
    setPage(1);
    setUsuarios([]);
    setHasMore(true);
    showSuccess("Eliminado", "El usuario ha sido eliminado.");
  }
};

  return (
    <div className="container mt-5 pt-5">
      <div className="bg-white shadow p-4 rounded">
        <h2 className="mb-4">Gestión de Usuarios</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-4 row">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o rol"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-3">
            <select name="role" className="form-select" value={form.role} onChange={handleChange}>
              <option value="employee">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="col-md-3">
            <input type="text" name="username" className="form-control" placeholder="Usuario" value={form.username} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
          <input 
            type="password" 
            name="password" 
            className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`} 
            placeholder="Contraseña" 
            value={form.password} 
            onChange={handleChange} 
            required={!editingId} 
          />
          {validationErrors.password && (
            <div className="invalid-feedback">{validationErrors.password}</div>
          )}
        </div>
          {form.role === 'employee' && (
            <>
              <div className="col-md-3">
                <input type="text" name="name" className="form-control" placeholder="Nombre del empleado" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <input type="number" name="salary" className="form-control" placeholder="Salario" value={form.salary} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <input type="date" name="hireDate" className="form-control" value={form.hireDate} onChange={handleChange} required />
              </div>
            </>
          )}
          <div className="col-md-3">
            <button className="btn btn-outline-info w-100">{editingId ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.id} ref={i === usuarios.length - 1 ? lastElementRef : null}>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(u)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && <div className="text-center my-3">Cargando...</div>}
        {!hasMore && usuarios.length > 0 && (
          <div className="text-center my-3 text-muted">No hay más usuarios</div>
        )}
      </div>
    </div>
  );
}
