import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Cotizador</Link>
      </div>

      <ul className="navbar-links">
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
      </ul>
    </nav>
  );
}
