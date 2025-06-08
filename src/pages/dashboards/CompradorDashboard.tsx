import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompradorDashboard.css';

const localesEjemplo = ['La Picá de Juan', 'Empanadas El Sol', 'Veggie Fresh', 'Pizzería Don Gusto'];

const productosEjemplo = [
  { nombre: 'Empanada de pino', local: 'La Picá de Juan', imagen: 'https://www.gourmet.cl/wp-content/uploads/2016/09/Empanadas-web-1.jpg' },
  { nombre: 'Pizza Margarita', local: 'Pizzería Don Gusto', imagen: 'https://source.unsplash.com/400x300/?pizza' },
  { nombre: 'Ensalada vegana', local: 'Veggie Fresh', imagen: 'https://source.unsplash.com/400x300/?salad' },
];

const CompradorDashboard: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [localSeleccionado, setLocalSeleccionado] = useState<string | null>(null);
  const navigate = useNavigate();

  const localesFiltrados = localesEjemplo.filter((l) =>
    l.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosFiltrados = localSeleccionado
    ? productosEjemplo.filter((p) => p.local === localSeleccionado)
    : [];

  return (
    <div className="comprador-dashboard">
      {/* Barra superior optimizada y dividida */}
      <nav className="navbar-opt">
        <div className="navbar-section logo-section">
          <span className="logo">VeciMarket</span>
        </div>
        <div className="navbar-section search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar locales o productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="navbar-section icons-section">
          <button className="icon-btn" onClick={() => navigate('/carrito')} title="Carrito">
            <img src="https://img.icons8.com/ios-filled/28/d87a9c/shopping-cart.png" alt="Carrito" />
          </button>
          <button className="icon-btn" onClick={() => navigate('/perfil')} title="Perfil">
            <img src="https://img.icons8.com/ios-filled/28/d87a9c/user.png" alt="Perfil" />
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="dashboard-body">
        {/* Barra lateral izquierda */}
        <aside className="sidebar">
          <h3>Buscar locales</h3>
          <ul className="lista-locales">
            {localesFiltrados.map((local, i) => (
              <li key={i}>
                <button onClick={() => setLocalSeleccionado(local)}>
                  {local}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Zona principal de productos */}
        <div className="productos-section">
          <h2>{localSeleccionado ? `Menú de ${localSeleccionado}` : 'Selecciona un local'}</h2>
          <div className="productos-grid">
            {productosFiltrados.map((producto, index) => (
              <div className="producto-card" key={index}>
                <img src={producto.imagen} alt={producto.nombre} />
                <h3>{producto.nombre}</h3>
                <button>Agregar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompradorDashboard;