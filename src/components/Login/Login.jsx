import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  return (
    <div className="login">
      <h2 className="login__title">Inicia sesión</h2>
      <form onSubmit={handleSubmit} className="login__form">
        <input
          required
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="login__input"
        />
        <input
          required
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="login__input"
        />
        <button type="submit" className="login__button">
          Inicia sesión
        </button>
      </form>
      <p className="login__text">
        ¿Aún no eres miembro? <Link to="/signup" className="login__link">Regístrate aquí</Link>
      </p>
    </div>
  );
}