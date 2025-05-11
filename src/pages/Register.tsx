import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [rol, setRol] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !correo || !clave || !confirmarClave || !rol) {
      alert('Completa todos los campos');
      return;
    }

    if (clave !== confirmarClave) {
      alert('Las contraseñas no coinciden');
      return;
    }

    alert(`Registro simulado:\nNombre: ${nombre}\nCorreo: ${correo}\nRol: ${rol}`);
    // Aquí podrías enviar los datos a tu backend/API
  };

  return (
    <div className="register-container">
      <div className="register-inner">
        <form className="register-form" onSubmit={handleRegister}>
          <div className="register-icon">
            <img src="https://img.icons8.com/ios-filled/100/ffffff/add-user-group-man-man.png" alt="Register" />
          </div>

          <h2>Crea tu cuenta</h2>

          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="register-input"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="register-input"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="register-input"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarClave}
            onChange={(e) => setConfirmarClave(e.target.value)}
            className="register-input"
          />

          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="register-input"
          >
            <option value="">Selecciona tu rol</option>
            <option value="comprador">Comprador</option>
            <option value="locatario">Locatario</option>
            <option value="repartidor">Repartidor</option>
          </select>

          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
