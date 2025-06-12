import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompradorDashboard.css';

// Define las interfaces para Local y Producto
// Estas interfaces son cruciales para el tipado en TypeScript
interface Local {
  id: string; // O number, según cómo los maneje tu backend
  nombre: string;
  // Agrega aquí otros campos que tu backend retorne para un local (ej. direccion, telefono)
}

interface Producto {
  id: string; // O number
  nombre: string;
  local: string; // Nombre del local al que pertenece el producto
  imagen: string; // URL de la imagen del producto
  // Agrega aquí otros campos que tu backend retorne para un producto (ej. precio, descripcion, categoria)
}

const CompradorDashboard: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [localSeleccionado, setLocalSeleccionado] = useState<string | null>(null);
  const [locales, setLocales] = useState<Local[]>([]); // Estado para almacenar los locales del backend
  const [productos, setProductos] = useState<Producto[]>([]); // Estado para almacenar los productos del backend
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores en la carga

  const navigate = useNavigate();

  // --- LÓGICA DE FILTRADO (AHORA TRABAJA CON LOS ESTADOS REALMENTE VACÍOS AL INICIO) ---
  const localesFiltrados = locales.filter((l) =>
    l.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosFiltrados = localSeleccionado
    ? productos.filter((p) => p.local === localSeleccionado)
    : productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.local.toLowerCase().includes(busqueda.toLowerCase())
      );

  // --- LÓGICA PARA HACER FETCH DE DATOS DESDE EL BACKEND (ESPACIO PARA TU IMPLEMENTACIÓN) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true); // Indicar que la carga ha comenzado
      setError(null); // Resetear cualquier error previo

      try {
        // --- AQUÍ ES DONDE CONECTARÁS TU BACKEND REAL ---
        // POR AHORA, LOS ARREGLOS QUEDARÁN VACÍOS HASTA QUE IMPLEMENTES LAS LLAMADAS FETCH REALES.
        // Ejemplo de cómo harías las llamadas reales (mantente comentado o bórralo si no lo necesitas aún):
        /*
        const localesResponse = await fetch('http://localhost:3000/api/locales');
        if (!localesResponse.ok) {
          throw new Error(`Error al cargar locales: ${localesResponse.statusText}`);
        }
        const fetchedLocales: Local[] = await localesResponse.json();
        setLocales(fetchedLocales);

        const productosResponse = await fetch('http://localhost:3000/api/productos');
        if (!productosResponse.ok) {
          throw new Error(`Error al cargar productos: ${productosResponse.statusText}`);
        }
        const fetchedProductos: Producto[] = await productosResponse.json();
        setProductos(fetchedProductos);
        */

        // Si no tienes el backend conectado aún, los estados `locales` y `productos`
        // permanecerán como arreglos vacíos `[]` por defecto.
        // Esto significa que la UI mostrará "No hay locales disponibles" y "No se encontraron productos".

      } catch (err: any) {
        console.error("Error al cargar datos del backend:", err);
        setError(err.message || "Error al cargar datos. Intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false); // La carga ha terminado, sea con éxito o error
      }
    };

    fetchInitialData();
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="comprador-page">
      <nav className="navbar-dashboard">
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
            <img src="https://img.icons8.com/ios-filled/28/ffffff/shopping-cart.png" alt="Carrito" />
          </button>
          <button className="icon-btn" onClick={() => navigate('/perfil')} title="Perfil">
            <img src="https://img.icons8.com/ios-filled/28/ffffff/user.png" alt="Perfil" />
          </button>
          <button className="icon-btn logout-btn" onClick={() => navigate('/')} title="Cerrar sesión">
             <img src="https://img.icons8.com/ios-filled/28/ffffff/exit.png" alt="Cerrar sesión" />
          </button>
        </div>
      </nav>

      <div className="dashboard-body">
        <aside className="sidebar">
          <h3 className="sidebar-title">Locales del Vecindario</h3>
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Filtrar locales..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <ul className="lista-locales">
            {isLoading ? (
              <li><p className="loading-message">Cargando locales...</p></li>
            ) : error ? (
              <li><p className="error-message">{error}</p></li>
            ) : localesFiltrados.length > 0 ? (
              localesFiltrados.map((local) => (
                <li key={local.id}>
                  <button
                    className={`local-button ${localSeleccionado === local.nombre ? 'selected' : ''}`}
                    onClick={() => setLocalSeleccionado(local.nombre)}
                  >
                    {local.nombre}
                  </button>
                </li>
              ))
            ) : (
              <li><p className="no-data-message">No hay locales disponibles.</p></li>
            )}
          </ul>
           {localSeleccionado && (
            <button
              className="local-button clear-selection-button"
              onClick={() => setLocalSeleccionado(null)}
            >
              Ver todos los productos
            </button>
          )}
        </aside>

        <main className="productos-section">
          <h2 className="productos-title">
            {localSeleccionado ? `Menú de ${localSeleccionado}` : 'Productos disponibles'}
          </h2>
          <div className="productos-grid">
            {isLoading ? (
              <p className="loading-message">Cargando productos...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <div className="producto-card" key={producto.id}>
                  <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
                  <div className="producto-info">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-local">De: {producto.local}</p>
                    <button className="add-to-cart-button">Agregar al Carrito</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products-message">
                {localSeleccionado
                  ? `No se encontraron productos para "${localSeleccionado}".`
                  : `No se encontraron productos que coincidan con tu búsqueda.`}
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompradorDashboard;