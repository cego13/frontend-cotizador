import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Al montar el componente, leer usuario guardado
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
     setUser(null);
    navigate("/login");
     window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Cotizador</Link>
      </div>

      <ul className="navbar-links">
        {user && (
          <>
            <li>
              <NavLink
                to="/empresas"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Empresas
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/clientes"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Clientes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cotizador"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Cotizador
              </NavLink>
            </li>

            {/* 🧑‍💼 Solo visible si es admin */}
            {user.role === "admin" && (
              <li>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Usuarios
                </NavLink>
              </li>
            )}

            {/* 🚪 Botón de Logout */}
            <li>
              <button onClick={handleLogout} className="logout-button">
                Cerrar sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}