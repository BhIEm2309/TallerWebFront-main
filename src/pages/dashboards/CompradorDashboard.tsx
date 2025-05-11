import React, { useState } from 'react';
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

  const localesFiltrados = localesEjemplo.filter((l) =>
    l.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosFiltrados = localSeleccionado
    ? productosEjemplo.filter((p) => p.local === localSeleccionado)
    : [];

  return (
    <div className="comprador-dashboard">
      {/* Navegación superior */}
      <nav className="navbar">
        <div className="logo">VeciMarket</div>
        <div className="nav-options">
          <button>Mi cuenta</button>
          <button>Carrito</button>
          <button>Salir</button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="dashboard-body">
        {/* Barra lateral izquierda */}
        <aside className="sidebar">
          <h3>Buscar locales</h3>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
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
