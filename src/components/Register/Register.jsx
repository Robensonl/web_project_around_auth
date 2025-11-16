import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register({ onRegister }) {
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
    onRegister(formData.email, formData.password);
  };

  return (
    <div className="Register">
      <h2 className="Register__title">Regístrate</h2>
      <form onSubmit={handleSubmit} className="Register__form">
        <input
          required
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="Register__input"
        />
        <input
          required
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="Register__input"
        />
        <button type="submit" className="Register__button">
          Regístrate
        </button>
      </form>
      <p className="Register__text">
        ¿Ya eres miembro? <Link to="/signin" className="Register__link">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}