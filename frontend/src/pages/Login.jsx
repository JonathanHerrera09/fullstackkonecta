import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', form);
      const token = res.data.token;
      const userData = res.data.user;
      login(userData, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error de conexión');
    }
  };

  const fillDemoCredentials = () => {
    setForm({ username: 'admin', password: '123456' });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white shadow rounded-4 p-5" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Bienvenido </h3>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Usuario</label>
            <input
              type="text"
              className="form-control shadow-sm"
              name="username"
              onChange={handleChange}
              value={form.username}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Contraseña</label>
            <input
              type="password"
              className="form-control shadow-sm"
              name="password"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 shadow-sm mb-2">
            Iniciar sesión
          </button>

          <button
            type="button"
            onClick={fillDemoCredentials}
            className="btn btn-outline-secondary w-100 shadow-sm"
          >
            Usar datos de prueba
          </button>
        </form>
      </div>
    </div>
  );
}
