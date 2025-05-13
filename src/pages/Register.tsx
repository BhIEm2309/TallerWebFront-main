import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [pais, setPais] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [numeroTelefono, setNumeroTelefono] = useState('');

  // Campos específicos
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [numeroCasaDepto, setNumeroCasaDepto] = useState('');
  const [nombreLocal, setNombreLocal] = useState('');
  const [numeroLocal, setNumeroLocal] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [patente, setPatente] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoUsuario || !nombre || !apellido || !correo || !clave || !confirmarClave || !pais || !ciudad || !numeroTelefono) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    if (clave !== confirmarClave) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (tipoUsuario === 'usuario' && (!nombreUsuario || !numeroCasaDepto)) {
      alert('Faltan datos específicos del usuario');
      return;
    }

    if (tipoUsuario === 'locatario' && (!nombreLocal || !numeroLocal)) {
      alert('Faltan datos específicos del locatario');
      return;
    }

    if (tipoUsuario === 'repartidor' && (!nombreUsuario || !vehiculo || !patente)) {
      alert('Faltan datos específicos del repartidor');
      return;
    }

    const datos = {
      tipoUsuario,
      nombre,
      apellido,
      correo,
      contraseña: clave,
      pais,
      ciudad,
      numeroTelefono,
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
        nombreUsuario,
        vehiculo,
        patente,
      }),
    };

    console.log('Datos listos para enviar:', datos);
    alert(`Registro simulado para tipo ${tipoUsuario}`);
  };

  return (
    <div className="register-container">
      <div className="register-inner">
        <form className="register-form" onSubmit={handleRegister}>
          <div className="register-icon">
            <img src="https://img.icons8.com/ios-filled/100/ffffff/add-user-group-man-man.png" alt="Register" />
          </div>

          <h2>Crea tu cuenta</h2>

          {/* Campos comunes */}
          <input className="register-input" type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input className="register-input" type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          <input className="register-input" type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <input className="register-input" type="password" placeholder="Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} />
          <input className="register-input" type="password" placeholder="Confirmar contraseña" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} />
          <input className="register-input" type="text" placeholder="País" value={pais} onChange={(e) => setPais(e.target.value)} />
          <input className="register-input" type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
          <input className="register-input" type="text" placeholder="Número de teléfono" value={numeroTelefono} onChange={(e) => setNumeroTelefono(e.target.value)} />

          {/* Tipo de usuario */}
          <select className="register-input" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
            <option value="">Selecciona tu tipo de usuario</option>
            <option value="usuario">Comprador</option>
            <option value="locatario">Locatario</option>
            <option value="repartidor">Repartidor</option>
          </select>

          {/* Campos específicos */}
          {tipoUsuario === 'usuario' && (
            <>
              <input className="register-input" type="text" placeholder="Nombre de usuario" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
              <input className="register-input" type="text" placeholder="Número de casa o depto" value={numeroCasaDepto} onChange={(e) => setNumeroCasaDepto(e.target.value)} />
            </>
          )}

          {tipoUsuario === 'locatario' && (
            <>
              <input className="register-input" type="text" placeholder="Nombre del local" value={nombreLocal} onChange={(e) => setNombreLocal(e.target.value)} />
              <input className="register-input" type="text" placeholder="Número del local" value={numeroLocal} onChange={(e) => setNumeroLocal(e.target.value)} />
            </>
          )}

          {tipoUsuario === 'repartidor' && (
            <>
              <input className="register-input" type="text" placeholder="Nombre de usuario" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
              <select className="register-input" value={vehiculo} onChange={(e) => setVehiculo(e.target.value)}>
                <option value="">Selecciona tu vehículo</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
              <input className="register-input" type="text" placeholder="Patente del vehículo" value={patente} onChange={(e) => setPatente(e.target.value)} />
            </>
          )}

          <button type="submit" className="register-button">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
