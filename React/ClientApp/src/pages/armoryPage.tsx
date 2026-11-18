import Button from "../components/ui/button/button";
import Modal from "../components/ui/modal/modal";
import GearForm from "../components/armory/gearForm";
import useModal from "../hooks/useModal";
import "./armoryPage.css";
import GearGrid from "../components/armory/gearGrid";
import { Grid2x2, List } from "lucide-react";
import { useState, useEffect } from "react";
import { getGearItems, type GearItem } from "../services/gearRepository";
const viewModeStorageKey = "armory-view-mode";

function ArmoryPage() {
  const [items, setItems] = useState<GearItem[]>([]);

  useEffect(() => {
    getGearItems().then(setItems);
  }, []);

  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (window.matchMedia("(max-width: 860px)").matches) {
      return "grid";
    }

    const savedViewMode = localStorage.getItem(viewModeStorageKey);

    return savedViewMode === "list" ? "list" : "grid";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 860px)");
    function handleScreenChange() {
      if (mediaQuery.matches) {
        setViewMode("grid");
      }
    }

    handleScreenChange();
    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(viewModeStorageKey, viewMode);
  }, [viewMode]);

  const {
    isOpen,
    openModal,
    closeModal,
  } = useModal();
  return (
    <main className="armory-page">
      <header className="armory-header">
          <p className="modal-eyebrow">Armory</p>
          <div className="armory-title-row">
            <h1>Uitrusting</h1>
            <div className="armory-actions">
              <Button onClick={openModal}>
                Uitrusting toevoegen
              </Button>
              <div className="gear-view-buttons">
                <button className={`gear-view-button ${viewMode === "grid" ? "gear-view-button-active" : ""}`} type="button" aria-label="Grid View" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                  <Grid2x2 size={20} strokeWidth={1.8} />
                </button>
                <button className={`gear-view-button ${viewMode === "list" ? "gear-view-button-active" : ""}`} type="button" aria-label="List view" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}>
                  <List size={20} strokeWidth={1.8} />
                </button>
            </div>
          </div>
        </div>
      </header>

      <GearGrid items={items} viewMode={viewMode} />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        eyebrow="Uitrusting"
        title="Uitrusting toevoegen"
      >
        <GearForm onCancel={closeModal} onSaved={(newItem) => { setItems((prev) => [...prev, newItem]); closeModal(); }} />
      </Modal>
    </main>
  )
}

export default ArmoryPage;