import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo || !clave) {
      alert('Por favor completa todos los campos.');
      return;
    }

    // Simulación de login
    alert(`Login simulado:\nCorreo: ${correo}\nClave: ${clave}`);
  };

  return (
    <div className="login-page"> {/* Este es ahora el contenedor principal */}
      <div className="login-card">
        {/* Sección izquierda: formulario */}
        <div className="login-left">
          {/* Si tienes un logo, puedes ponerlo aquí. Si no, quita esta línea o pon un texto. */}
          {/* <img src="/logo-vecimarket.png" alt="VeciMarket Logo" className="login-logo" /> */}
          <h1 className="login-main-title">¡Bienvenido!</h1>
          <p className="login-subtitle">Accede a tu cuenta de VeciMarket</p>

          {/* Card interior para estilo */}
          <div className="login-form-inner-card">
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="correo" className="login-label">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  className="login-input"
                  placeholder="tu_correo@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="clave" className="login-label">Contraseña</label>
                <input
                  type="password"
                  id="clave"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                  className="login-input"
                  placeholder="••••••••"
                />
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" className="checkbox-input" /> Recordarme
                </label>
                <a href="#" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="login-action-button">Iniciar sesión</button>
              <button
                type="button"
                className="login-back-button"
                onClick={() => navigate('/')}
              >
                ← Volver al inicio
              </button>
            </form>
          </div>
        </div>

        {/* Sección derecha: imagen decorativa */}
        <div className="login-right">
          <img
            src="https://img.freepik.com/vector-gratis/edificio-tiendas-vectores-dibujos-animados-calle-ciudad-vista-rascacielos-urbanos-ilustracion-isometrica-apartamentos-cerca-tranvia-ciudad-nadie-dia-soleado-arquitectura-juegos-retro-papel-tapiz-grafico-2d_107791-22114.jpg"
            alt="Ilustración vecinal"
            className="decorative-image"
          />
          <div className="overlay-text">
            <h3>Tu Mercado Vecinal Digital</h3>
            <p>Conecta con tu comunidad, apoya lo local.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;