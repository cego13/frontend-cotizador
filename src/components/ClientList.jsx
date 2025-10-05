export default function ClientList({ clients, onEdit, onDelete }) {
  if (!clients.length) return <p>No hay clientes registrados.</p>;

  return (
    <table className="company-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Documento</th>
          <th>Correo</th>
          <th>Teléfono</th>
          <th>Contacto</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((c) => (
          <tr key={c._id}>
            <td>{c.name}</td>
            <td>{c.document}</td>
            <td>{c.email}</td>
            <td>{c.phone}</td>
            <td>{c.contactName}</td>
            <td>
              <button onClick={() => onEdit(c)}>Editar</button>
              <button onClick={() => onDelete(c._id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
