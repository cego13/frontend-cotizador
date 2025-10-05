import { useEffect, useState } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient
} from "../services/clientService";
import ClientForm from "../components/ClientForm";
import ClientList from "../components/ClientList";

export default function ClientesPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSubmit = async (formData) => {
    if (selectedClient) {
      await updateClient(selectedClient._id, formData);
    } else {
      await createClient(formData);
    }
    setSelectedClient(null);
    loadClients();
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar cliente?")) {
      await deleteClient(id);
      loadClients();
    }
  };

  return (
    <div className="empresas-page">
      <h2>Gestión de Clientes</h2>

      <ClientForm
        onSubmit={handleSubmit}
        selectedClient={selectedClient}
        onCancel={() => setSelectedClient(null)}
      />

      <ClientList
        clients={clients}
        onEdit={setSelectedClient}
        onDelete={handleDelete}
      />
    </div>
  );
}

