import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmpresasPage from "./pages/EmpresasPage";
import ClientesPage from "./pages/ClientesPage";
import CotizadorPage from "./pages/CotizadorPage";
import AdminNotesPage from "./pages/AdminNotesPage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminUsersPage from "./pages/AdminUsersPage";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      {/* Mostrar Navbar solo si el usuario está autenticado */}
      {isAuthenticated && <Navbar />}

      <main className="main-content">
        <Routes>
          {/* Página de Login (pública) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/empresas"
            element={
              <PrivateRoute>
                <EmpresasPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <ClientesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cotizador"
            element={
              <PrivateRoute>
                <CotizadorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-notes"
            element={
              <PrivateRoute>
                <AdminNotesPage />
              </PrivateRoute>
            }
            
          />
          <Route path="/admin/users" element={<AdminUsersPage />} />

          {/* Redirecciones */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/empresas" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
