import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUsersPage.css";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editingUser, setEditingUser] = useState(null);
  const token = localStorage.getItem("token");

 const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

  // Cargar lista de usuarios
  const loadUsers = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Manejar cambios del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", email: "", password: "", role: "user" });
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  // Editar usuario
  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        loadUsers();
      } catch (error) {
        console.error("Error eliminando usuario:", error);
      }
    }
  };

  return (
    <div className="admin-users-page">
      <h1>Gestión de Usuarios</h1>

      <form onSubmit={handleSubmit} className="user-form">
        <h2>{editingUser ? "Editar Usuario" : "Crear Usuario"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required={!editingUser}
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        <div className="form-buttons">
          <button type="submit" className="submit-button">
            {editingUser ? "Actualizar" : "Registrar"}
          </button>

          {editingUser && (
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setForm({ name: "", email: "", password: "", role: "user" });
              }}
              className="cancel-button"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 className="table-title">Lista de Usuarios</h2>
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(u)}>
                    Editar
                  </button>
                  <button className="delete" onClick={() => handleDelete(u._id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
