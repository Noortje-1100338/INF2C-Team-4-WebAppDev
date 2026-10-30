import { Link, useLocation} from "react-router";
import type { Report } from '../components/archive/reports';
import "./reportDetailsPage.css";

function ReportDetailsPage() {

    // Haalt het gekozen rapport op (op wat er is geklikt)
    const location = useLocation();

    // Haalt de gegevens van de gekozen rapport op
    const report = (
        location.state as { report?: Report } | null
        )?.report;

    // foutmelding als er geen rapport is
    if (!report) {
        return (
            <main className="report-details-page">
                <h1>Report not found</h1>
                <p>
                    Open a report from the archive to view its details.
                </p>
                <Link to="/archive"className="back-to-archive">
                    ← Back to Archive
                </Link>
            </main>
        );
    }

        return (
        <main className="report-details-page">
            {/* Link terug naar the main archive page. */}
            <Link to="/archive"className="back-to-archive">
                    ← Back to Archive
                </Link>
            
            <header className="report-details-header">
                    <div>
                        <p className="report-details-eyebrow">
                            ARCHIVE/REPORT
                        </p>
                        <h1>{report.description}</h1>
                        <p>Written by: {report.writtenBy ?? "You"}</p>
                    </div>

                    <span
                        className={`report-status report-status-${report.status}`}
                    >
                        {report.status}
                    </span>
                </header>

                <section className="report-details-section">
                    <h2>Expedition details</h2>
                    <p>
                        <strong>Region:</strong> {report.region}
                    </p>
                    <p>
                        <strong>Departure</strong> {report.departureDate}
                    </p>
                </section>

                <section className="report-details-section">
                    <h2>What happened?</h2>
                    <p className="report-details-description">
                        {report.description}
                    </p>
                </section>

                <section className="report-details-section">
                    <div className="encounters-details-header">
                        <h2>Encounters</h2>
                        <span>{report.encounters.length}</span>
                    </div>
                
                {report.encounters.length === 0 ? (
                    <p className="no-encounters">
                        No encounters have been recorded for this expedition.
                    </p>
                ) : (
                    <div className="encounters-detail-list">
                        {report.encounters.map((encounter, index) => (
                            <article
                                className="encounter-details-card"
                                key={encounter.id}
                            >
                                <h3>
                                    {index + 1}. {encounter.creature}
                                </h3>

                                <p className="encounter-outcome-label">
                                    Outcome
                                </p>

                                <p className="encounter-outcome">
                                    {encounter.outcome || "No outcome recorded."}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default ReportDetailsPage
        



