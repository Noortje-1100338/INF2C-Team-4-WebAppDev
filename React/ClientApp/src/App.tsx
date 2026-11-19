import { NavLink, Route, Routes, useLocation } from "react-router";
import ArmoryPage from "./pages/armoryPage";
import QuestPage from "./pages/questPage";
import ArchivePage from "./pages/archivePage";
import ReportDetailsPage from "./pages/reportDetailsPage";
import AuthPage from "./pages/auth/authPage";
import "./global.css";
import {useState, useEffect} from "react";
import { Home, Sword, ScrollText, Trees, BookOpen, Bug, ChevronLeft, ChevronRight, X } from "lucide-react";
import GearDetailPage from "./pages/detailGear/gearDetailPage";
import { ToastProvider } from "./context/toastContext";
import { useNavigate, Navigate } from "react-router";
import { LogOut } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/armory", label: "Armory", icon: Sword },
  { to: "/quest", label: "Quests", icon: ScrollText },
  { to: "/archive", label: "Archive", icon: Trees },
  { to: "/gear", label: "Gear", icon: BookOpen },
  { to: "/bugs", label: "Bugs", icon: Bug }
];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppLayout() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/auth");
  }

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }),[];
  return (
    <div className="page">
      {isMobile && !collapsed && (
        <div className="sidebar-backdrop" onClick={() => setCollapsed(true)} />
      )}
      <nav className={`sidebar${collapsed ? " sidebar--collapsed" : ""}${isMobile ? " sidebar--mobile" : ""}`}>
        <div className="sidebar-header">
          {!collapsed && <h2>Hollowmere</h2>}
          <button className="sidebar-toggle" onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {isMobile
            ? (collapsed ? <ChevronRight size={20} strokeWidth={1.8} /> : <X size={20} strokeWidth={1.8} />)
            : (collapsed ? <ChevronRight size={20} strokeWidth={1.8} /> : <ChevronLeft size={20} strokeWidth={1.8} />)}
          </button>
        </div>
        <div className="pages-on-menu">
          {navItems.map(({to, label, icon: Icon}) => (
            <NavLink key={to} to={to} title={collapsed ? label : undefined} onClick={() => isMobile && setCollapsed(true)}>
              <Icon size={18} className="nav-icon" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </div>
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout} title={collapsed ? "Uitloggen" : undefined}>
            <LogOut size={18} className="nav-icon" />
            {!collapsed && <span>Uitloggen</span>}
          </button>
        </div>
      </nav>

      <main className="content">
        <Routes>
            <Route path="/armory" element={<ArmoryPage />} />
            <Route path="/quest" element={<QuestPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route
              path="/archive/:reportId"
              element={<ReportDetailsPage />}
            />
            <Route path="/armory/:id" element={<GearDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
      </Routes>
    </ToastProvider>
  );
}
export default App;
