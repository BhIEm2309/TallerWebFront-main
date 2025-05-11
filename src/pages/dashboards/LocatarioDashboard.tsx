import React, { useState } from 'react';
import './LocatarioDashboard.css';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  ingredientes: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

const LocatarioDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    categoria: '',
    ingredientes: '',
    descripcion: '',
    precio: '',
    imagen: '',
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarCrearCategoria, setMostrarCrearCategoria] = useState(false);
  const [formCategoria, setFormCategoria] = useState('');
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormulario({ ...formulario, categoria: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      const tempUrl = URL.createObjectURL(file);
      setFormulario({ ...formulario, imagen: tempUrl });
    }
  };

  const handleAgregarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, categoria, precio, imagen } = formulario;
    if (!nombre || !categoria || !precio || !imagen) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const nuevoProducto: Producto = {
      id: Date.now(),
      nombre,
      categoria,
      ingredientes: formulario.ingredientes,
      descripcion: formulario.descripcion,
      precio: parseFloat(precio),
      imagen,
    };

    setProductos([...productos, nuevoProducto]);
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoEditando) return;

    const productosActualizados = productos.map((p) =>
      p.id === productoEditando.id
        ? {
            ...productoEditando,
            nombre: formulario.nombre,
            categoria: formulario.categoria,
            ingredientes: formulario.ingredientes,
            descripcion: formulario.descripcion,
            precio: parseFloat(formulario.precio),
            imagen: formulario.imagen,
          }
        : p
    );

    setProductos(productosActualizados);
    limpiarFormulario();
    setProductoEditando(null);
  };

  const handleEliminarProducto = (id: number) => {
    const confirmado = confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (confirmado) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: '',
      categoria: '',
      ingredientes: '',
      descripcion: '',
      precio: '',
      imagen: '',
    });
    setImagenFile(null);
  };

  const productosPorCategoria = categorias.map((cat) => ({
    categoria: cat,
    productos: productos.filter((p) => p.categoria === cat),
  })).filter((g) => g.productos.length > 0);

  return (
    <div className="locatario-dashboard">
      <nav className="navbar">
        <div className="logo">Panel Locatario</div>
        <div className="nav-options">
          <button onClick={() => setMostrarFormulario(true)}>Agregar Producto</button>
          <button onClick={() => setMostrarCrearCategoria(true)}>Crear Categoría</button>
          <button>Mi cuenta</button>
          <button>Salir</button>
        </div>
      </nav>

      <div className="contenido">
        {productosPorCategoria.map(({ categoria, productos }) => (
          <div key={categoria} className="bloque-categoria">
            <h3>{categoria}</h3>
            <div className="grid-productos">
              {productos.map((producto) => (
                <div className="card-producto" key={producto.id}>
                  <img src={producto.imagen} alt={producto.nombre} />
                  <h4>{producto.nombre}</h4>
                  <p className="precio">${producto.precio}</p>
                  <p className="descripcion">{producto.descripcion}</p>
                  <p className="ingredientes">
                    <strong>Ingredientes:</strong> {producto.ingredientes}
                  </p>
                  <button
                    onClick={() => {
                      setProductoEditando(producto);
                      setFormulario({
                        nombre: producto.nombre,
                        categoria: producto.categoria,
                        ingredientes: producto.ingredientes,
                        descripcion: producto.descripcion,
                        precio: producto.precio.toString(),
                        imagen: producto.imagen,
                      });
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminarProducto(producto.id)}
                    className="btn-eliminar"
                  >
                    🗑 Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Formularios flotantes (Agregar, Editar, Categoría) aquí abajo, sin cambios */}
      {/* ... igual que antes ... */}
      {mostrarFormulario && (
        <div className="overlay" onClick={() => setMostrarFormulario(false)}>
          <form className="formulario-flotante" onClick={(e) => e.stopPropagation()} onSubmit={handleAgregarProducto}>
            <button className="cerrar" onClick={() => setMostrarFormulario(false)}>×</button>
            <h3>Agregar Producto</h3>
            <input type="text" name="nombre" placeholder="Nombre del producto" value={formulario.nombre} onChange={handleInputChange} />
            <select name="categoria" value={formulario.categoria} onChange={handleSelectChange}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <textarea name="ingredientes" placeholder="Ingredientes" value={formulario.ingredientes} onChange={handleTextareaChange} />
            <textarea name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={handleTextareaChange} />
            <input type="number" name="precio" placeholder="Precio" value={formulario.precio} onChange={handleInputChange} />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formulario.imagen && <img src={formulario.imagen} alt="preview" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />}
            <button type="submit">Agregar</button>
          </form>
        </div>
      )}

      {productoEditando && (
        <div className="overlay" onClick={() => setProductoEditando(null)}>
          <form className="formulario-flotante" onClick={(e) => e.stopPropagation()} onSubmit={handleGuardarEdicion}>
            <button className="cerrar" onClick={() => setProductoEditando(null)}>×</button>
            <h3>Editar Producto</h3>
            <input type="text" name="nombre" placeholder="Nombre del producto" value={formulario.nombre} onChange={handleInputChange} />
            <select name="categoria" value={formulario.categoria} onChange={handleSelectChange}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <textarea name="ingredientes" placeholder="Ingredientes" value={formulario.ingredientes} onChange={handleTextareaChange} />
            <textarea name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={handleTextareaChange} />
            <input type="number" name="precio" placeholder="Precio" value={formulario.precio} onChange={handleInputChange} />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formulario.imagen && <img src={formulario.imagen} alt="preview" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />}
            <button type="submit">Guardar Cambios</button>
          </form>
        </div>
      )}

      {mostrarCrearCategoria && (
        <div className="overlay" onClick={() => setMostrarCrearCategoria(false)}>
          <div className="formulario-flotante" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar" onClick={() => setMostrarCrearCategoria(false)}>×</button>
            <h3>Nueva Categoría</h3>
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={formCategoria}
              onChange={(e) => setFormCategoria(e.target.value)}
            />
            <button
              onClick={() => {
                const nueva = formCategoria.trim();
                if (nueva && !categorias.includes(nueva)) {
                  setCategorias([...categorias, nueva]);
                  setFormCategoria('');
                  setMostrarCrearCategoria(false);
                }
              }}
            >
              Crear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocatarioDashboard;
