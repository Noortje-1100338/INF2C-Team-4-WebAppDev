import { NavLink, Route, Routes } from "react-router";
import ArmoryPage from "./pages/armoryPage";
import QuestPage from "./pages/questPage";
import ArchivePage from "./pages/archivePage";
import ReportDetailsPage from "./pages/reportDetailsPage";
import "./global.css";

function App() {
  return (
    <div className="page">
      <nav className="sidebar">
        <h2>Hollowmere</h2>

        <div className="pages-on-menu">
          <NavLink to="/">Hall</NavLink>
          <NavLink to="/armory">Armory</NavLink>
          <NavLink to="/quest">Quest Board</NavLink>
          <NavLink to="/yard">Yard</NavLink>
          <NavLink to="/archive">Archive</NavLink>
          <NavLink to="/bestiary">Bestiary</NavLink>
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
        </Routes>
      </main>
    </div>
  );
}
export default App;
