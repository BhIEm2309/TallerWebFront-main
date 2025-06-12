import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [direccion, setDireccion] = useState(''); // Renombrado a direccion por consistencia
  const [telefono, setTelefono] = useState(''); // Renombrado a telefono por consistencia

  // Campos específicos
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuarioRepartidor, setUsuarioRepartidor] = useState('');
  const [numeroCasaDepto, setNumeroCasaDepto] = useState('');
  const [nombreLocal, setNombreLocal] = useState('');
  const [numeroLocal, setNumeroLocal] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [patente, setPatente] = useState('');

  const navigate = useNavigate();

  const registerUser = async (datos: any) => {
    try {
      const response = await fetch('http://localhost:3000/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en el registro');
      }
      return response.json();
    } catch (err: any) {
      throw new Error(err.message || 'Error de conexión');
    }
  };

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert('Registro exitoso');
      navigate('/');
    },
    onError: (error: any) => {
      alert('Error en el registro: ' + error.message);
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoUsuario || !nombre || !apellido || !correo || !clave || !confirmarClave || !direccion || !telefono) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    if (clave !== confirmarClave) {
      alert('Las claves no coinciden');
      return;
    }

    if (tipoUsuario === 'usuario' && (!nombreUsuario || !numeroCasaDepto)) {
      alert('Faltan datos específicos del comprador');
      return;
    }

    if (tipoUsuario === 'locatario' && (!nombreLocal || !numeroLocal)) {
      alert('Faltan datos específicos del locatario');
      return;
    }

    if (tipoUsuario === 'repartidor' && (!usuarioRepartidor || !vehiculo || !patente)) {
      alert('Faltan datos específicos del repartidor');
      return;
    }

    const datos = {
      tipoUsuario,
      nombre,
      apellido,
      correo,
      clave: clave,
      direccion,
      telefono,
      ...(tipoUsuario === 'usuario' && {
        nombreUsuario,
        numeroCasaDepto,
      }),
      ...(tipoUsuario === 'locatario' && {
        nombreLocal,
        numeroLocal,
        comidasStock: [],
        ventas: [],
      }),
      ...(tipoUsuario === 'repartidor' && {
        usuarioRepartidor,
        vehiculo,
        patente,
      }),
    };
    mutation.mutate(datos);
    console.log('Datos listos para enviar:', datos);
    // alert(`Registro simulado para tipo ${tipoUsuario}`); // Comentar o quitar si ya usas mutation.mutate
  };

  return (
    <div className="register-page"> {/* Nuevo contenedor principal para el fondo */}
      <div className="register-card"> {/* Esta será nuestra "card" principal */}
        <div className="register-left"> {/* La sección izquierda, similar al login */}
          {/* Opcional: Puedes poner un logo aquí si tienes uno, como en el login */}
          {/* <img src="/logo-vecimarket.png" alt="VeciMarket Logo" className="register-logo" /> */}
          <h1 className="register-main-title">Únete a VeciMarket</h1>
          <p className="register-subtitle">Crea tu cuenta y empieza a disfrutar de tu comunidad</p>

          <div className="register-form-inner-card"> {/* La "inner-card" para el formulario */}
            <form className="register-form" onSubmit={handleRegister}>
              {/* Campos comunes */}
              <div className="form-group">
                <label htmlFor="nombre" className="register-label">Nombre</label>
                <input className="register-input" type="text" id="nombre" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="apellido" className="register-label">Apellido</label>
                <input className="register-input" type="text" id="apellido" placeholder="Tu apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="correo" className="register-label">Correo electrónico</label>
                <input className="register-input" type="email" id="correo" placeholder="tu_correo@ejemplo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="clave" className="register-label">Contraseña</label>
                <input className="register-input" type="password" id="clave" placeholder="••••••••" value={clave} onChange={(e) => setClave(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmarClave" className="register-label">Confirmar contraseña</label>
                <input className="register-input" type="password" id="confirmarClave" placeholder="••••••••" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="direccion" className="register-label">Dirección</label>
                <input className="register-input" type="text" id="direccion" placeholder="Ej: Calle 123" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="telefono" className="register-label">Teléfono</label>
                <input className="register-input" type="text" id="telefono" placeholder="Ej: +56912345678" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
              </div>

              {/* Tipo de usuario */}
              <div className="form-group">
                <label htmlFor="tipoUsuario" className="register-label">Tipo de usuario</label>
                <select className="register-input" id="tipoUsuario" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)} required>
                  <option value="">Selecciona tu tipo de usuario</option>
                  <option value="usuario">Comprador</option>
                  <option value="locatario">Locatario</option>
                  <option value="repartidor">Repartidor</option>
                </select>
              </div>

              {/* Campos específicos */}
              {tipoUsuario === 'usuario' && (
                <>
                  <div className="form-group">
                    <label htmlFor="nombreUsuario" className="register-label">Nombre de usuario (Comprador)</label>
                    <input className="register-input" type="text" id="nombreUsuario" placeholder="Tu nombre de usuario" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="numeroCasaDepto" className="register-label">Número de casa o depto</label>
                    <input className="register-input" type="text" id="numeroCasaDepto" placeholder="Ej: 123 B" value={numeroCasaDepto} onChange={(e) => setNumeroCasaDepto(e.target.value)} required />
                  </div>
                </>
              )}

              {tipoUsuario === 'locatario' && (
                <>
                  <div className="form-group">
                    <label htmlFor="nombreLocal" className="register-label">Nombre del local</label>
                    <input className="register-input" type="text" id="nombreLocal" placeholder="Nombre de tu negocio" value={nombreLocal} onChange={(e) => setNombreLocal(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="numeroLocal" className="register-label">Número del local</label>
                    <input className="register-input" type="text" id="numeroLocal" placeholder="Ej: Local 5" value={numeroLocal} onChange={(e) => setNumeroLocal(e.target.value)} required />
                  </div>
                </>
              )}

              {tipoUsuario === 'repartidor' && (
                <>
                  <div className="form-group">
                    <label htmlFor="usuarioRepartidor" className="register-label">Nombre de usuario (Repartidor)</label>
                    <input className="register-input" type="text" id="usuarioRepartidor" placeholder="Tu nombre de usuario" value={usuarioRepartidor} onChange={(e) => setUsuarioRepartidor(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vehiculo" className="register-label">Tipo de vehículo</label>
                    <select className="register-input" id="vehiculo" value={vehiculo} onChange={(e) => setVehiculo(e.target.value)} required>
                      <option value="">Selecciona tu vehículo</option>
                      <option value="auto">Auto</option>
                      <option value="moto">Moto</option>
                      <option value="bicicleta">Bicicleta</option> {/* Añadido por si acaso */}
                      <option value="pie">A pie</option> {/* Añadido por si acaso */}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="patente" className="register-label">Patente del vehículo</label>
                    <input className="register-input" type="text" id="patente" placeholder="Ej: ABCD-12" value={patente} onChange={(e) => setPatente(e.target.value)} required />
                  </div>
                </>
              )}

              <button type="submit" className="register-action-button">
                Registrarse
              </button>
              <button
                type="button"
                className="register-back-button"
                onClick={() => navigate('/')}
              >
                ← Volver al inicio
              </button>
            </form>
          </div>
        </div>

        {/* Sección derecha: imagen decorativa, similar al login */}
        <div className="register-right">
          <img
            src="https://img.freepik.com/foto-gratis/arreglo-comida-tradicional-alto-angulo_23-2148708221.jpg?semt=ais_hybrid&w=740" /* Cambiado a una imagen que se vea bien en fondo café */
            alt="Ilustración ciudad"
            className="decorative-image"
          />
          <div className="overlay-text">
            <h3>Conecta con tu Comunidad</h3>
            <p>Forma parte de la red de VeciMarket</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;