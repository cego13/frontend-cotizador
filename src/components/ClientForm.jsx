import { useEffect, useState } from "react";
import "./Company.css";

const initialForm = {
  name: "",
  document: "",
  address: "",
  city: "",
  country: "Colombia",
  email: "",
  phone: "",
  contactName: "",
  contactPosition: "",
  contactEmail: "",
  contactPhone: ""
};

export default function ClientForm({ onSubmit, selectedClient, onCancel }) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (selectedClient) setFormData(selectedClient);
  }, [selectedClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="company-form">
      <h3>{selectedClient ? "Editar Cliente" : "Nuevo Cliente"}</h3>

      <label>Nombre:</label>
      <input name="name" value={formData.name} onChange={handleChange} required />

      <label>NIT / Documento:</label>
      <input name="document" value={formData.document} onChange={handleChange} />

      <label>Dirección:</label>
      <input name="address" value={formData.address} onChange={handleChange} />

      <label>Ciudad:</label>
      <input name="city" value={formData.city} onChange={handleChange} />

      <label>País:</label>
      <input name="country" value={formData.country} onChange={handleChange} />

      <label>Correo:</label>
      <input name="email" type="email" value={formData.email} onChange={handleChange} />

      <label>Teléfono:</label>
      <input name="phone" value={formData.phone} onChange={handleChange} />

      <h4>Persona de Contacto</h4>
      <label>Nombre:</label>
      <input name="contactName" value={formData.contactName} onChange={handleChange} />

      <label>Cargo:</label>
      <input name="contactPosition" value={formData.contactPosition} onChange={handleChange} />

      <label>Correo:</label>
      <input name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} />

      <label>Teléfono:</label>
      <input name="contactPhone" value={formData.contactPhone} onChange={handleChange} />

      <div className="form-actions">
        <button type="submit">{selectedClient ? "Actualizar" : "Crear"}</button>
        {selectedClient && <button onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  );
}
