import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Login.css';

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      alert(`Login simulado para ${username}.`);
      // Aquí podrías agregar validación contra un backend real en el futuro.
    } else {
      alert('Por favor completa todos los campos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-inner">
        <form className="login-form" onSubmit={handleCustomLogin}>
          <div className="login-icon">
            <img src="https://img.icons8.com/ios-filled/100/ffffff/user.png" alt="User" />
          </div>

          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Recordarme
            </label>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>

          <hr className="login-separator" />
          <button
            type="button"
            className="login-button auth0"
            onClick={() => loginWithRedirect()}
          >
            Iniciar sesión con Auth0
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
