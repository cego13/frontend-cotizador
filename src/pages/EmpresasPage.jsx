import { useEffect, useState } from "react";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany
} from "../services/companyService";
import CompanyForm from "../components/CompanyForm";
import CompanyList from "../components/CompanyList";
import "./EmpresasPage.css";

export default function EmpresasPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const loadCompanies = async () => {
    const data = await getCompanies();
    setCompanies(data);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleSubmit = async (formData) => {
    if (selectedCompany) {
      await updateCompany(selectedCompany._id, formData);
    } else {
      await createCompany(formData);
    }
    setSelectedCompany(null);
    loadCompanies();
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar empresa?")) {
      await deleteCompany(id);
      loadCompanies();
    }
  };

  return (
    <div className="empresas-page">
      <h2>Gestión de Empresas</h2>

      <CompanyForm
        onSubmit={handleSubmit}
        selectedCompany={selectedCompany}
        onCancel={() => setSelectedCompany(null)}
      />

      <CompanyList
        companies={companies}
        onEdit={setSelectedCompany}
        onDelete={handleDelete}
      />
    </div>
  );
}
