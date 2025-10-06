import { useEffect, useState } from "react";
import { getCompanies } from "../services/companyService";
import { getClients } from "../services/clientService";
import { getQuotations, createQuotation, updateQuotation } from "../services/quotationService";
import { getNotes } from "../services/noteService";
import "./CotizadorForm.css";

export default function CotizadorForm() {
  const [companies, setCompanies] = useState([]);
  const [clients, setClients] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [items, setItems] = useState([]);
  const [quotationNumber, setQuotationNumber] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [predefinedNotes, setPredefinedNotes] = useState([]);
  const [activeNotes, setActiveNotes] = useState([]); // Array para manejar múltiples notas
  const [editingId, setEditingId] = useState(null);

  const IVA_RATE = 0.19;

  // --- Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      const [c1, c2, q, n] = await Promise.all([
        getCompanies(),
        getClients(),
        getQuotations(),
        getNotes() 
      ]);
      setCompanies(c1);
      setClients(c2);
      setQuotations(q);
      setPredefinedNotes(n);
    };
    loadData();
  }, []);

  // --- cálculos automáticos
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice || 0), 0);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  // --- manejo de ítems
  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "description" || field === "longDescription" ? value : Number(value);
    setItems(updated);
  };
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  // --- Manejo de Múltiples Notas (como ítems)
  const addNoteField = (initialText = "") => {
    setActiveNotes([...activeNotes, { text: initialText }]);
  };

  const updateNote = (index, value) => {
    const updated = [...activeNotes];
    updated[index].text = value;
    setActiveNotes(updated);
  };

  const removeNote = (index) => {
    setActiveNotes(activeNotes.filter((_, i) => i !== index));
  };
  
  const handleSelectPredefinedNote = (e) => {
    const noteText = e.target.value;
    if (noteText) {
        addNoteField(noteText);
        e.target.value = ""; 
    }
  };
  
  // --- enviar al backend
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Verificar campos obligatorios
  if (!selectedCompany || !selectedClient || !quotationNumber) {
    alert("Debes llenar el número de cotización, empresa y cliente.");
    return;
  }

  if (items.length === 0) {
    alert("Debe haber al menos un ítem.");
    return;
  }

  // Concatenar notas si existen
  const finalNotesText = activeNotes
    .map(note => note.text.trim())
    .filter(text => text.length > 0)
    .join("\n\n");

  // Crear el objeto para enviar al backend
  const payload = {
    quotationNumber,
    company: selectedCompany,
    client: selectedClient,
    items: items.map(it => ({
      description: it.description,
      longDescription: it.longDescription,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      total: it.quantity * it.unitPrice
    })),
    subtotal,
    iva,
    total,
    notes: finalNotesText || "",
    customMessage
  };

  try {
    let result;

    if (editingId) {
      // 🟡 Actualizar cotización existente
      result = await updateQuotation(editingId, payload);
      alert("Cotización actualizada correctamente");
    } else {
      // 🟢 Crear nueva cotización
      result = await createQuotation(payload);
      alert("Cotización creada correctamente");

      // 🧾 Abrir PDF automáticamente después de crear
      if (result._id) {
        const timestamp = new Date().getTime(); // ✅ Número único para evitar cache
        const pdfUrl = `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/api/quotations/${result._id}/pdf?ts=${timestamp}`;
        window.open(pdfUrl, "_blank");
      }
    }

    // 🔄 Refrescar lista de cotizaciones
    const updatedQuotations = await getQuotations();
    setQuotations(updatedQuotations);
  } catch (error) {
    console.error("Error al guardar cotización:", error);
  }
};

  const handleEdit = (quotation) => {
    setEditingId(quotation._id);
    setQuotationNumber(quotation.quotationNumber);
    setSelectedCompany(quotation.company?._id || "");
    setSelectedClient(quotation.client?._id || "");
    // Al editar, separamos la nota grande en un solo objeto para editar
    setActiveNotes(quotation.notes ? [{ text: quotation.notes }] : []);
    setCustomMessage(quotation.customMessage || "");
    setItems(quotation.items || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

 const handleViewPDF = (id) => {
  const timestamp = new Date().getTime(); // ✅ Número único para evitar cache
  const pdfUrl = `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/api/quotations/${id}/pdf?ts=${timestamp}`;
  window.open(pdfUrl, "_blank");
};

  return (
    <div>
      <form className="cotizador-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Editar Cotización" : "Nueva Cotización"}</h3>

        {/* --- Información Principal (Empresa, Cliente, Mensaje) --- */}
        <label>Número de cotización:</label>
        <input value={quotationNumber} onChange={(e) => setQuotationNumber(e.target.value)} required />

        <label>Empresa emisora:</label>
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} required>
          <option value="">Seleccione una empresa...</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <label>Cliente:</label>
        <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} required>
          <option value="">Seleccione un cliente...</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <label>Mensaje personalizado:</label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={3}
          placeholder="Escribe aquí el mensaje que aparecerá debajo de 'Cordial saludo.' en el PDF"
        />
        
        {/* --- Sección de Ítems (Primer orden) --- */}
        <h4>Ítems</h4>
        <table className=" quotation-table td">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Valor Unitario</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, index) => (
              <tr key={index}>
                <td>
                  <input value={it.description} onChange={(e) => updateItem(index, "description", e.target.value)} placeholder="Descripción corta" required />
                  <textarea value={it.longDescription || ""} onChange={(e) => updateItem(index, "longDescription", e.target.value)} placeholder="Descripción detallada (opcional)" rows={2} style={{ width: "100%", marginTop: "5px" }} />
                </td>
                <td><input type="number" min="1" value={it.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} /></td>
                <td><input type="number" min="0" value={it.unitPrice} onChange={(e) => updateItem(index, "unitPrice", e.target.value)} /></td>
                <td>${(it.quantity * it.unitPrice).toLocaleString()}</td>
                <td><button type="button" onClick={() => removeItem(index)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={addItem}>➕ Agregar Ítem</button>

        {/* --- Totales (Segundo orden) --- */}
        <div className="totals">
          <p><strong>Subtotal:</strong> ${subtotal.toLocaleString()}</p>
          <p><strong>IVA (19%):</strong> ${iva.toLocaleString()}</p>
          <p><strong>Total:</strong> ${total.toLocaleString()}</p>
        </div>
        
        {/* --- Sección de Notas (Tercer orden, nueva ubicación) --- */}
        <hr style={{margin: "20px 0"}} />
        <h4>Notas de la Cotización</h4>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
            <label style={{ margin: 0 }}>Añadir nota predefinida:</label>
            <select onChange={handleSelectPredefinedNote} value="">
                <option value="">Seleccione para agregar...</option>
                {predefinedNotes.map((note) => (
                    <option key={note._id} value={note.text}>{note.text.substring(0, 50)}...</option>
                ))}
            </select>
            <button type="button" onClick={() => window.location.href = "/admin-notes"}>⚙️ Administrar</button>
        </div>

        {activeNotes.map((note, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px', position: 'relative' }}>
                <textarea
                    value={note.text}
                    onChange={(e) => updateNote(index, e.target.value)}
                    rows={4}
                    placeholder={`Nota #${index + 1}: Escribe aquí la nota...`}
                    style={{ width: "100%", boxSizing: "border-box" }}
                    required
                />
                <button 
                    type="button" 
                    onClick={() => removeNote(index)} 
                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}
                >
                    🗑️
                </button>
            </div>
        ))}

        <button type="button" onClick={() => addNoteField("")}>➕ Agregar Nota Manual</button>
        
        <hr style={{margin: "20px 0"}} />
        {/* FIN DE SECCIÓN DE NOTAS */}

        <button type="submit">{editingId ? "Guardar Cambios" : "Guardar Cotización y Ver PDF"}</button>
      </form>

      {/* --- Lista de Cotizaciones --- */}
      <h3 style={{ marginTop: "40px" }}>Cotizaciones Creadas</h3>
      <table className="quotation-table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Empresa</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((q) => (
            <tr key={q._id}>
              <td>{q.quotationNumber}</td>
              <td>{q.company?.name}</td>
              <td>{q.client?.name}</td>
              <td>{new Date(q.createdAt).toLocaleDateString()}</td>
              <td>${q.total.toLocaleString()}</td>
              <td>
                <button onClick={() => handleViewPDF(q._id)}>📄 Ver PDF</button>{" "}
                <button onClick={() => handleEdit(q)}>✏️ Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}