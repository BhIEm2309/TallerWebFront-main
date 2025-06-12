import React, { useState, useEffect } from 'react';
import './LocatarioDashboard.css'; // Asegúrate de que este CSS esté en el mismo directorio

// Interfaces para Producto y Categoría
// Usaremos 'string' para los IDs ya que es más común en backends reales
interface Producto {
  id: string; // ID único para el producto
  nombre: string;
  categoriaId: string; // El ID de la categoría a la que pertenece el producto
  ingredientes: string;
  descripcion: string;
  precio: number;
  imagen: string; // URL de la imagen (puede ser local o externa)
}

interface Categoria {
  id: string; // ID único para la categoría
  nombre: string;
}

// Datos de ejemplo hardcodeados
const categoriasEjemplo: Categoria[] = [
  { id: 'cat-1', nombre: 'Pizzas Artesanales' },
  { id: 'cat-2', nombre: 'Bebidas Naturales' },
  { id: 'cat-3', nombre: 'Postres Caseros' },
  { id: 'cat-4', nombre: 'Comida Rápida' },
];

const productosEjemplo: Producto[] = [
  {
    id: 'prod-1',
    nombre: 'Pizza Margherita Clásica',
    categoriaId: 'cat-1',
    ingredientes: 'Tomate, Mozzarella, Albahaca fresca',
    descripcion: 'Nuestra receta tradicional, simple y deliciosa.',
    precio: 9500,
    imagen: 'https://source.unsplash.com/400x300/?pizza-margherita',
  },
  {
    id: 'prod-2',
    nombre: 'Jugo de Naranja Natural',
    categoriaId: 'cat-2',
    ingredientes: 'Naranjas frescas',
    descripcion: 'Recién exprimido, sin azúcares añadidos.',
    precio: 2800,
    imagen: 'https://source.unsplash.com/400x300/?orange-juice',
  },
  {
    id: 'prod-3',
    nombre: 'Tiramisú Cremoso',
    categoriaId: 'cat-3',
    ingredientes: 'Café, mascarpone, bizcochos de soletilla',
    descripcion: 'Un clásico italiano para endulzar el día.',
    precio: 5500,
    imagen: 'https://source.unsplash.com/400x300/?tiramisu',
  },
  {
    id: 'prod-4',
    nombre: 'Hamburguesa Americana',
    categoriaId: 'cat-4',
    ingredientes: 'Carne, queso cheddar, lechuga, tomate, cebolla',
    descripcion: 'Clásica hamburguesa con los mejores ingredientes.',
    precio: 7800,
    imagen: 'https://source.unsplash.com/400x300/?hamburger',
  },
  {
    id: 'prod-5',
    nombre: 'Pizza Vegetariana',
    categoriaId: 'cat-1',
    ingredientes: 'Tomate, mozzarella, pimentón, cebolla, champiñones',
    descripcion: 'Una opción fresca y llena de sabor.',
    precio: 10500,
    imagen: 'https://source.unsplash.com/400x300/?pizza-vegetarian',
  },
  {
    id: 'prod-6',
    nombre: 'Limonada Menta Jengibre',
    categoriaId: 'cat-2',
    ingredientes: 'Limón, menta, jengibre, agua, azúcar (opcional)',
    descripcion: 'Refrescante y con un toque picante.',
    precio: 3200,
    imagen: 'https://source.unsplash.com/400x300/?lemonade-mint-ginger',
  },
];


const LocatarioDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>(productosEjemplo);
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasEjemplo);
  const [formulario, setFormulario] = useState({
    nombre: '',
    categoriaId: '', // Guarda el ID de la categoría seleccionada
    ingredientes: '',
    descripcion: '',
    precio: '', // Lo mantenemos como string para el input y lo parseamos al guardar
    imagen: '', // URL de la imagen
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarCrearCategoria, setMostrarCrearCategoria] = useState(false);
  const [formCategoriaNombre, setFormCategoriaNombre] = useState(''); // Nombre de la nueva categoría a crear
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

  // Handlers para los campos del formulario (simplificado en uno)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // Función para abrir el formulario de agregar/editar producto
  const handleOpenProductForm = (product: Producto | null = null) => {
    setProductoEditando(product);
    if (product) {
      // Si estamos editando, precargar el formulario con los datos del producto
      setFormulario({
        nombre: product.nombre,
        categoriaId: product.categoriaId,
        ingredientes: product.ingredientes,
        descripcion: product.descripcion,
        precio: product.precio.toString(),
        imagen: product.imagen,
      });
    } else {
      // Si estamos agregando, limpiar el formulario
      limpiarFormulario();
    }
    setMostrarFormulario(true);
  };

  // Handler para agregar o editar un producto
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const { nombre, categoriaId, precio, imagen } = formulario;
    if (!nombre || !categoriaId || !precio || !imagen) {
      alert('Por favor, completa todos los campos obligatorios (Nombre, Categoría, Precio, URL de Imagen).');
      return;
    }

    // Validar que la URL de la imagen sea válida (una pequeña validación)
    try {
        new URL(imagen);
    } catch (_) {
        alert('Por favor, ingresa una URL de imagen válida.');
        return;
    }


    const nuevoProducto: Producto = {
      id: productoEditando ? productoEditando.id : `prod-${Date.now()}`, // Generar ID único si es nuevo
      nombre,
      categoriaId,
      ingredientes: formulario.ingredientes,
      descripcion: formulario.descripcion,
      precio: parseFloat(precio), // Convertir precio a número
      imagen,
    };

    if (productoEditando) {
      // Editar producto existente
      setProductos(productos.map(p =>
        p.id === nuevoProducto.id ? nuevoProducto : p
      ));
    } else {
      // Agregar nuevo producto
      setProductos([...productos, nuevoProducto]);
    }

    setMostrarFormulario(false);
    limpiarFormulario();
    setProductoEditando(null);
  };

  // Handler para eliminar un producto
  const handleEliminarProducto = (id: string) => {
    const confirmado = confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (confirmado) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  // Handler para crear una nueva categoría
  const handleCrearCategoria = () => {
    const nuevaNombre = formCategoriaNombre.trim();
    if (nuevaNombre && !categorias.some(cat => cat.nombre.toLowerCase() === nuevaNombre.toLowerCase())) {
      const nuevaCategoria: Categoria = {
        id: `cat-${Date.now()}`, // Generar ID único para la categoría
        nombre: nuevaNombre,
      };
      setCategorias([...categorias, nuevaCategoria]);
      setFormCategoriaNombre('');
      setMostrarCrearCategoria(false);
    } else if (nuevaNombre) {
      alert('La categoría ya existe.');
    }
  };

  // Limpia el formulario
  const limpiarFormulario = () => {
    setFormulario({
      nombre: '',
      categoriaId: '',
      ingredientes: '',
      descripcion: '',
      precio: '',
      imagen: '',
    });
  };

  // Agrupa los productos por categoría para el renderizado
  const productosPorCategoria = categorias
    .map((cat) => ({
      categoria: cat, // Retorna el objeto categoría completo
      productos: productos.filter((p) => p.categoriaId === cat.id),
    }))
    .filter((g) => g.productos.length > 0); // Solo muestra categorías que tengan productos

  return (
    <div className="locatario-dashboard">
      <nav className="navbar">
        <div className="logo">Panel Locatario</div>
        <div className="nav-options">
          <button onClick={() => handleOpenProductForm()}>Agregar Producto</button>
          <button onClick={() => { setMostrarCrearCategoria(true); setFormCategoriaNombre(''); }}>Crear Categoría</button>
          <button>Mi cuenta</button>
          <button>Salir</button>
        </div>
      </nav>

      <div className="contenido">
        {productosPorCategoria.length > 0 ? (
          productosPorCategoria.map(({ categoria, productos }) => (
            <div key={categoria.id} className="bloque-categoria">
              <h3>{categoria.nombre}</h3>
              <div className="grid-productos">
                {productos.map((producto) => (
                  <div className="card-producto" key={producto.id}>
                    <img src={producto.imagen} alt={producto.nombre} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }} /> {/* Fallback de imagen */}
                    <h4>{producto.nombre}</h4>
                    <p className="precio">${producto.precio.toLocaleString('es-CL')}</p> {/* Formato de moneda chilena */}
                    <p className="descripcion">{producto.descripcion}</p>
                    <p className="ingredientes">
                      <strong>Ingredientes:</strong> {producto.ingredientes}
                    </p>
                    {/* ¡Nuevo contenedor para los botones! */}
                    <div className="button-group">
                        <button onClick={() => handleOpenProductForm(producto)}>
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarProducto(producto.id)}
                          className="btn-eliminar"
                        >
                          🗑 Eliminar
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-message">No hay productos ni categorías disponibles. ¡Crea el primero!</p>
        )}
      </div>

      {/* Formulario flotante para Agregar/Editar Producto */}
      {mostrarFormulario && (
        <div className="overlay" onClick={() => { setMostrarFormulario(false); limpiarFormulario(); setProductoEditando(null); }}>
          <form className="formulario-flotante" onClick={(e) => e.stopPropagation()} onSubmit={handleSaveProduct}>
            <button className="cerrar" onClick={() => { setMostrarFormulario(false); limpiarFormulario(); setProductoEditando(null); }}>×</button>
            <h3>{productoEditando ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <input type="text" name="nombre" placeholder="Nombre del producto" value={formulario.nombre} onChange={handleInputChange} />
            
            {/* El select ahora muestra los nombres de las categorías y guarda su ID */}
            <select name="categoriaId" value={formulario.categoriaId} onChange={handleInputChange}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            
            <textarea name="ingredientes" placeholder="Ingredientes" value={formulario.ingredientes} onChange={handleInputChange} />
            <textarea name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={handleInputChange} />
            <input type="number" name="precio" placeholder="Precio" value={formulario.precio} onChange={handleInputChange} />
            <input
              type="text" // Input de texto para la URL de la imagen
              name="imagen"
              placeholder="URL de la imagen del producto"
              value={formulario.imagen}
              onChange={handleInputChange}
            />
            {formulario.imagen && <img src={formulario.imagen} alt="previsualización" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />}
            <button type="submit">{productoEditando ? 'Guardar Cambios' : 'Agregar'}</button>
          </form>
        </div>
      )}

      {/* Formulario flotante para Crear Categoría */}
      {mostrarCrearCategoria && (
        <div className="overlay" onClick={() => setMostrarCrearCategoria(false)}>
          <div className="formulario-flotante" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar" onClick={() => setMostrarCrearCategoria(false)}>×</button>
            <h3>Nueva Categoría</h3>
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={formCategoriaNombre}
              onChange={(e) => setFormCategoriaNombre(e.target.value)}
            />
            <button onClick={handleCrearCategoria}>Crear</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocatarioDashboard;