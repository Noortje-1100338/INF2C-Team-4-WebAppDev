import { NavLink, Route, Routes } from "react-router";
import ArmoryPage from "./pages/armoryPage";
import QuestPage from "./pages/questPage";
import ArchivePage from "./pages/archivePage";
import ReportDetailsPage from "./pages/reportDetailsPage";
import "./global.css";
import {useState, useEffect} from "react";
import { Home, Sword, ScrollText, Trees, BookOpen, Bug, ChevronLeft, ChevronRight, X } from "lucide-react";
import GearDetailPage from "./pages/detailGear/gearDetailPage";


const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/armory", label: "Armory", icon: Sword },
  { to: "/quest", label: "Quests", icon: ScrollText },
  { to: "/archive", label: "Archive", icon: Trees },
  { to: "/gear", label: "Gear", icon: BookOpen },
  { to: "/bugs", label: "Bugs", icon: Bug }
];
function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);

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
export default App;
