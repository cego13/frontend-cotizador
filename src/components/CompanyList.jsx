import "./Company.css";

export default function CompanyList({ companies, onEdit, onDelete }) {
  if (!companies.length) return <p>No hay empresas registradas.</p>;

  return (
    <div className="company-table-container">
    <table className="company-table">
      <thead>
        <tr>
          <th>Logo</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Encargado</th>
          <th>Cargo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((c) => (
          <tr key={c._id}>
            <td>{c.logoUrl && <img src={c.logoUrl} alt="logo" width="50" />}</td>
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>{c.representative.name}</td>
            <td>{c.representative.position}</td>
            <td>
              <button className="edit" onClick={() => onEdit(c)}>Editar</button>
              <button  onClick={() => onDelete(c._id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
