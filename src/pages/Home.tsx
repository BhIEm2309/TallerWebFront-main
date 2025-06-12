import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Banner superior */}
      <div className="top-banner">
        <span className="top-banner-text">
          Bienvenido a VeciMarket - Tu mercado vecinal digital
        </span>
      </div>

      {/* Cabecera */}
      <div className="home-header-card">
        <h1 className="home-title">VeciMarket</h1>
        <p className="home-subtitle">Tu mercado vecinal online</p>
        <p className="home-subtitle">Compra local, apoya a tu comunidad</p>
      </div>

      {/* Cards */}
      <div className="card-grid">
        <div className="home-card">
          <h2>¿Ya tienes cuenta?</h2>
          <p>Accede a tu perfil y continúa comprando local.</p>
          <Link to="/login" className="card-button">Iniciar sesión</Link>
        </div>

        <div className="home-card">
          <h2>¿Eres nuevo?</h2>
          <p>Únete a nuestra comunidad y apoya el comercio del barrio.</p>
          <Link to="/register" className="card-button">Registrarse</Link>
        </div>
      </div>

      {/* Info con imagen y texto */}
      <div className="info-card">
        <div className="info-section">
          <div className="info-text">
            Esta plataforma conecta a compradores, locatarios y repartidores de un mismo vecindario.
            Nuestro objetivo es digitalizar el comercio de barrio, facilitar el acceso a productos locales,
            mejorar la visibilidad de pequeños emprendedores y fomentar una logística colaborativa.
            <br /><br />
            Todo desde una aplicación simple, cercana y hecha a medida de nuestra comunidad.
          </div>
          <div className="info-image">
            <img
              src="https://img.freepik.com/vector-gratis/edificio-tiendas-vectores-dibujos-animados-calle-ciudad-vista-rascacielos-urbanos-ilustracion-isometrica-apartamentos-cerca-tranvia-ciudad-nadie-dia-soleado-arquitectura-juegos-retro-papel-tapiz-grafico-2d_107791-22114.jpg"
              alt="Ilustración mercado vecinal"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="home-footer">
        <p className="footer-text">VeciMarket © 2025 · Proyecto universitario para fomentar el comercio local.</p>
      </div>
    </div>
  );
};

export default Home;
