import { useState, useEffect } from "react";
import "./Company.css";

const initialForm = {
  name: "",
  nit: "", // 🆕 campo agregado
  logoUrl: "",
  email: "",
  representative: {
    name: "",
    position: "",
    email: "",
    phone: "",
    signatureUrl: ""
  }
};

export default function CompanyForm({ onSubmit, selectedCompany, onCancel }) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (selectedCompany) setFormData(selectedCompany);
  }, [selectedCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("representative.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        representative: { ...formData.representative, [key]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="company-form">
      <h3>{selectedCompany ? "Editar Empresa" : "Nueva Empresa"}</h3>

      <label>Nombre:</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* 🆕 Campo de NIT */}
      <label>NIT:</label>
      <input
        name="nit"
        value={formData.nit}
        onChange={handleChange}
        required
      />

      <label>Logo (URL):</label>
      <input
        name="logoUrl"
        value={formData.logoUrl}
        onChange={handleChange}
      />

      <label>Correo Empresa:</label>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <h4>Encargado</h4>

      <label>Nombre:</label>
      <input
        name="representative.name"
        value={formData.representative.name}
        onChange={handleChange}
        required
      />

      <label>Cargo:</label>
      <input
        name="representative.position"
        value={formData.representative.position}
        onChange={handleChange}
      />

      <label>Correo:</label>
      <input
        name="representative.email"
        type="email"
        value={formData.representative.email}
        onChange={handleChange}
      />

      <label>Teléfono:</label>
      <input
        name="representative.phone"
        value={formData.representative.phone}
        onChange={handleChange}
      />

      <label>Firma (URL):</label>
      <input
        name="representative.signatureUrl"
        value={formData.representative.signatureUrl}
        onChange={handleChange}
      />

      <div className="form-actions">
        <button type="submit">
          {selectedCompany ? "Actualizar" : "Crear"}
        </button>
        {selectedCompany && <button onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  );
}
