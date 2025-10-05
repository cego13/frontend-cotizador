import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmpresasPage from "./pages/EmpresasPage";
import ClientesPage from "./pages/ClientesPage";
import CotizadorPage from "./pages/CotizadorPage";
import AdminNotesPage from "./pages/AdminNotesPage";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/empresas" />} />
          <Route path="/empresas" element={<EmpresasPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/cotizador" element={<CotizadorPage />} />
           <Route path="/admin-notes" element={<AdminNotesPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
