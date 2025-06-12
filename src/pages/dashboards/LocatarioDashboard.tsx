import React, { useState } from 'react';
import './LocatarioDashboard.css';

// Cambia la interfaz Producto para reflejar el id real de MongoDB
interface Producto {
  _id: string;
  nombre: string;
  categoria: string;
  ingredientes: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

// Cambia el estado de categorías a objetos con _id y nombre
interface Categoria {
  _id: string;
  nombre: string;
}

const API_URL = import.meta.env.VITE_API_URL_LOCATARIOS || 'http://localhost:3001';

const LocatarioDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
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

  // Usa el id correcto del locatario guardado en localStorage
  const locatarioId = localStorage.getItem('userId');

  // Carga categorías desde el backend como objetos
  React.useEffect(() => {
    if (!locatarioId) return;
    fetch(`${API_URL}/categorias?locatario=${locatarioId}`)
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]));
  }, [locatarioId]);

  // Carga productos desde el backend al montar el componente o cuando cambia el locatarioId
  React.useEffect(() => {
    if (!locatarioId) return;
    fetch(`${API_URL}/productos?locatario=${locatarioId}`)
      .then(res => res.json())
      .then(data => {
        // Normaliza la propiedad de imagen
        setProductos(
          data.map((prod: any) => ({
            ...prod,
            imagen: prod.imagenUrl || '',
            categoria: prod.categoria._id || prod.categoria // Soporta populate o id plano
          }))
        );
      })
      .catch(() => setProductos([]));
  }, [locatarioId]);

  // Subida de imagen a imgbb (puedes poner tu propia API key de imgbb)
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('https://api.imgbb.com/1/upload?key=TU_API_KEY', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  };

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

  const handleAgregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, categoria, precio } = formulario;
    if (!nombre || !categoria || !precio) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    if (!locatarioId) {
      alert('No se encontró el id del locatario');
      return;
    }
    let imagenUrl = '';
    if (imagenFile) {
      try {
        imagenUrl = await uploadImage(imagenFile);
      } catch (err) {
        alert('Error al subir la imagen. El producto se guardará sin imagen.');
      }
    }
    const body = {
      nombre,
      categoria,
      ingredientes: formulario.ingredientes,
      descripcion: formulario.descripcion,
      precio: parseFloat(precio),
      imagenUrl, // este campo es el que espera el backend
      locatario: locatarioId,
    };
    const res = await fetch(`${API_URL}/productos/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      // Recarga productos desde el backend para reflejar la imagen real
      fetch(`${API_URL}/productos?locatario=${locatarioId}`)
        .then(res => res.json())
        .then(data => {
          setProductos(
            data.map((prod: any) => ({
              ...prod,
              imagen: prod.imagenUrl || '',
              categoria: prod.categoria._id || prod.categoria
            }))
          );
        });
      limpiarFormulario();
      setMostrarFormulario(false);
    } else {
      alert('Error al agregar producto');
    }
  };

  // Eliminar producto en backend
  const handleEliminarProducto = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    const res = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      // Elimina el producto del estado local sin recargar toda la lista
      setProductos(productos.filter((p) => p._id !== id));
    } else {
      alert('Error al eliminar producto');
    }
  };

  // Editar producto en backend
  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoEditando) return;
    let imagenUrl = formulario.imagen;
    // Si el usuario subió una nueva imagen, súbela a tu backend GridFS
    if (imagenFile) {
      try {
        const formData = new FormData();
        formData.append('file', imagenFile);
        const resImg = await fetch(`${API_URL}/imagenes/upload`, {
          method: 'POST',
          body: formData,
        });
        const dataImg = await resImg.json();
        imagenUrl = `/imagenes/${dataImg.fileId}`;
      } catch (err) {
        alert('Error al subir la imagen. Se mantendrá la anterior.');
      }
    }
    const body = {
      nombre: formulario.nombre,
      categoria: formulario.categoria,
      ingredientes: formulario.ingredientes,
      descripcion: formulario.descripcion,
      precio: parseFloat(formulario.precio),
      imagenUrl, // este campo es el que espera el backend
      locatario: locatarioId,
    };
    const res = await fetch(`${API_URL}/productos/${productoEditando._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      // Recarga productos desde el backend para reflejar la imagen real
      fetch(`${API_URL}/productos?locatario=${locatarioId}`)
        .then(res => res.json())
        .then(data => {
          setProductos(
            data.map((prod: any) => ({
              ...prod,
              imagen: prod.imagenUrl || '',
              categoria: prod.categoria._id || prod.categoria
            }))
          );
        });
      limpiarFormulario();
      setProductoEditando(null);
    } else {
      alert('Error al editar producto');
    }
  };

  // Crear categoría en backend
  const handleCrearCategoria = async () => {
    const nueva = formCategoria.trim();
    if (!nueva || categorias.find(cat => cat.nombre === nueva)) return;
    if (!locatarioId) {
      alert('No se encontró el id del locatario');
      return;
    }
    const res = await fetch(`${API_URL}/categorias/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nueva, locatario: locatarioId })
    });
    if (res.ok) {
      const cat = await res.json();
      setCategorias([...categorias, cat]);
      setFormCategoria('');
      setMostrarCrearCategoria(false);
    } else {
      alert('Error al crear categoría');
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
    categoria: cat.nombre,
    productos: productos.filter((p) => p.categoria === cat._id),
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
                <div className="card-producto" key={producto._id}>
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
                    onClick={() => handleEliminarProducto(producto._id)}
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
                <option key={cat._id} value={cat._id}>{cat.nombre}</option>
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
                <option key={cat._id} value={cat._id}>{cat.nombre}</option>
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
              onClick={handleCrearCategoria}
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
