import type React from "react";
import { useState } from "react";
import Button from "../ui/button/button";
import "../archive/reportsForm.css"
import type {Report, Encounter} from "../archive/reports"

interface ReportFromProps {
    onCancel: () => void;
    onSaved: (report: Report) => void;
}

function ReportsForm({ onCancel, onSaved }: ReportFromProps) {
    const [encounters, setEncounters] = useState<Encounter[]>([]);


    function addEncounter() {
        setEncounters((currentEncounters) => [
            ...currentEncounters,
            {
                id: crypto.randomUUID(),
                creature: "",
                outcome: "",
            },
        ]);
    }

    function updateEncounter(id: string, field: "creature" | "outcome", value: string) 
    {
        setEncounters((currentEncounters) => 
        currentEncounters.map((encounter) => 
        encounter.id === id
        ? {...encounter, [field]: value }
        : encounter 
            )
        );
    }

    function removeEncounter(id: string) {
        setEncounters((currentEncounters) =>
            currentEncounters.filter((encounter) => encounter.id !== id)
        );
    }

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const report: Report = {
            id: crypto.randomUUID(),
            region: String(formData.get("region")).trim(),
            departureDate: String(formData.get("departureDate")),
            description: String(formData.get("description")).trim(),
            status: "draft",
            encounters: encounters
                .map((encounter) => ({
                    ...encounter,
                    creature: encounter.creature.trim(),
                    outcome: encounter.outcome.trim(),
                }))
                .filter(
                    (encounter) => encounter.creature && encounter.outcome
                ),
        };

        onSaved(report);
        event.currentTarget.reset();
        setEncounters([]);
    }
    return (
            <form className="report-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="reportRegion">Region</label>
                    <input
                        type="text"
                        id="reportRegion"
                        name="region"
                        placeholder="Region van de expeditie"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="departureDate">Dag van vertrek</label>
                    <input
                        type="date"
                        id="departureDate"
                        name="departureDate"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reportDescription">Wat gebeurde er?</label>
                    <textarea
                        id="reportDescription"
                        name="description"
                        placeholder="Beschrijf wat er tijdens de expeditie gebeurde..."
                        required
                    />
                </div>

                <section className="encounters-section">
                    <div className="encounters-header">
                        <h3>Encounters</h3>

                        <Button 
                            type="button" 
                            className="add-encounter-button"
                            onClick={addEncounter}
                        >
                            + Add encounter
                        </Button>
                    </div>

                    {encounters.map((encounter, index) => (
                        <div 
                            className="encounters-form-card"
                            key={encounter.id}
                        >
                            <div className="encounter-card-header">
                                <h4>Encounter {index + 1}</h4>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => 
                                        removeEncounter(encounter.id)
                                    }
                                >
                                    Remove
                                </Button>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor={`creature-${encounter.id}`}>
                                    Creature
                                </label>
                                <input
                                    id={`creature-${encounter.id}`}
                                    type="text"
                                    value={encounter.creature}
                                    onChange={(event) =>
                                        updateEncounter(
                                            encounter.id,
                                            "creature",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Name of the creature"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor={`outcome-${encounter.id}`}>
                                    Outcome
                                </label>
                                <textarea 
                                    id={`outcome-${encounter.id}`}
                                    value={encounter.outcome}
                                    onChange={(event) => 
                                        updateEncounter(
                                            encounter.id,
                                            "outcome",
                                            event.target.value
                                        )
                                    }
                                    placeholder="What happened to the party and creature?"
                                />
                            </div>
                        </div>
                    ))}
                </section>

                <div className="modal-actions">
                    <Button type="submit">Draft Opslaan</Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Annuleren
                    </Button>
                </div>
            </form>
    );
}

export default ReportsForm



