import "./archivePage.css";
import { useState } from "react";
import Button from "../components/ui/button/button";
import Modal from "../components/ui/modal/modal";
import ReportsForm from "../components/archive/reportsForm";
import type { Report } from "../components/archive/reports";
import { Link } from "react-router";


function ArchivePage() {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [reports, setReports] = useState<Report[]>([
    {
      id: "example-1",
      region: "Western Marsh",
      departureDate: "2026-03-12",
      description: "The Marsh Expedition",
      status: "filed",
      writtenBy: "Aragorn",
      encounters: [],
    },

    {
      id: "example-2",
      region: "Ford Valley",
      departureDate: "2026-03-18",
      description: "The Haunted Mill",
      status: "draft",
      writtenBy: "Legolas",
      encounters: [],
    },
  ]);

  function handleSaveReport(report: Report) {
    setReports((currentReports) => [
      ...currentReports,
      report,
    ]);

    closeModal();
  }

  function handleFileReport(id: string) {
    setReports((currentReports) => 
    currentReports.map((report) => 
    report.id === id 
      ? {...report, status: "filed"} 
      : report
      )
    );
  }

 

  return (
    <main className="archive-page">
      <header className="archive-page-header">
        <div>
          <h1>Archive</h1>
          <p>Your Reports</p>
        </div>

        <Button onClick={openModal}>
          Add Report
        </Button>
      </header>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        eyebrow="Archive"
        title="Report toevoegen"
      >
        <ReportsForm
        onCancel={closeModal}
        onSaved={handleSaveReport}
        />
      </Modal>

      <div className="reports">
        {reports.map((report) => (
          <div className="report-card" key={report.id}>
            <h3>
                <Link
                to={`/archive/${report.id}`}
                state={{ report }}
                className="report-card-link"
              >
                {report.description}
              </Link>
            </h3>
            
            <div className="report-card-details">
              <p>
                Written by: {report.writtenBy ?? "You"}
              </p>
              <p>Region: {report.region}</p>
              <p>Departure: {report.departureDate}</p>
            </div>

            <div className="report-card-footer">
              <span
              className={`report-status report-status-${report.status}`}
            >
              {report.status}
              </span>

            {report.status === "draft" && (
              <Button
              className="file-report-button"
              onClick={() => handleFileReport(report.id)}
              >
                File report
              </Button>
            )}
          </div>
        </div>
        ))}
      </div>
    </main>
  );
}
export default ArchivePage;