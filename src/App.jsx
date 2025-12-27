import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToHash } from "./components/ScrollToHash";
import Home from "./pages/Home";
import ServiceTemplate from "./pages/ServiceTemplate";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardPage from "./pages/admin/DashboardPage";
import QuotesPage from "./pages/admin/QuotesPage";
import AppointmentsPage from "./pages/admin/AppointmentsPage";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRt";
import ServiceAreas from "./pages/ServiceAreas";
import ContactPage from "./pages/ContactPage";
import QuotePage from "./pages/QuotePage"; 
import OurServices from "./pages/OurServices";
import AppointmentPage from "./pages/AppointmentPage";
import ScrollToTop from "./components/ScrollToTop";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin/dashboard") || 
                       location.pathname.startsWith("/admin/quotes") || 
                       location.pathname.startsWith("/admin/appointments");

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-white overflow-x-hidden w-full max-w-full">
      {!isAdminRoute && <Header />}
      <main className="pt-0 overflow-x-hidden w-full max-w-full">
        <div className="mx-auto w-full max-w-full overflow-x-hidden">
          <Routes>
            <Route path="/service-areas" element={<ServiceAreas />} />
            <Route path="/" element={<Home />} />
            <Route path="/service/:serviceKey" element={<ServiceTemplate />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/our-services" element={<OurServices />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <DashboardPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quotes"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <QuotesPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AppointmentsPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollToHash />
      <AppContent />
    </Router>
  );
}

export default App;
