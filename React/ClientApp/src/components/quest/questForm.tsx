import { useState, type FormEvent } from "react";
import Button from "../ui/button/button";
import {
  questCreatures,
  type Quest,
  type QuestDetails,
  type QuestMember,
} from "../../services/questRepository";
import "./questForm.css";

interface QuestFormProps {
  member: QuestMember;
  initialQuest?: Quest;
  onCancel: () => void;
  onSave: (details: QuestDetails) => string | null;
}

function getDepartureDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getQuestDetails(
  formData: FormData,
  hasCreature: boolean,
): QuestDetails {
  return {
    village: String(formData.get("village")).trim(),
    areaDescription: String(formData.get("areaDescription")).trim(),
    creatureId: hasCreature ? Number(formData.get("creatureId")) : null,
    departureDate: String(formData.get("departureDate")),
    durationDays: Number(formData.get("durationDays")),
    partySize: Number(formData.get("partySize")),
  };
}

function QuestForm({ member, initialQuest, onCancel, onSave }: QuestFormProps) {
  const [hasCreature, setHasCreature] = useState(
    Boolean(initialQuest?.creatureId),
  );
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(initialQuest);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setIsSaving(true);
    try {
      const saveError = await onSave(getQuestDetails(formData, hasCreature));
      setError(saveError ?? "");
    } catch {
      setError("Opslaan is niet gelukt.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="quest-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="village-name">Dorp</label>
        <input
          type="text"
          id="village-name"
          name="village"
          defaultValue={initialQuest?.village}
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description-quest">Beschrijving van het gebied</label>
        <textarea
          id="description-quest"
          name="areaDescription"
          rows={3}
          defaultValue={initialQuest?.areaDescription}
          maxLength={1000}
          required
        />
      </div>

      <fieldset className="checkbox-group">
        <legend>Bijzonderheden</legend>
        <label className="checkbox-option" htmlFor="creature">
          <input
            type="checkbox"
            id="creature"
            checked={hasCreature}
            onChange={(event) => setHasCreature(event.target.checked)}
          />
          Er is een wezen aanwezig
        </label>

        {hasCreature && (
          <div className="form-group creature-details">
            <label htmlFor="creature-choice">Wezen uit de bestiary</label>
            <select
              id="creature-choice"
              name="creatureId"
              defaultValue={initialQuest?.creatureId ?? ""}
              required
            >
              <option value="">Kies een wezen</option>
              {questCreatures.map((creature) => (
                <option key={creature.id} value={creature.id}>
                  {creature.name} - {creature.region}
                  {creature.dangerous ? " (gevaarlijk)" : ""}
                </option>
              ))}
            </select>
            {!member.trained && (
              <p className="form-help">
                Een gevaarlijke quest moet worden geleid door een getraind lid.
              </p>
            )}
          </div>
        )}
      </fieldset>

      <div className="form-group">
        <label htmlFor="departure-date">Vertrekdatum</label>
        <input
          type="date"
          id="departure-date"
          name="departureDate"
          min={getDepartureDate()}
          defaultValue={initialQuest?.departureDate}
          required
        />
      </div>

      <div className="quest-end">
        <div className="form-group">
          <label htmlFor="duration-days">Aantal dagen</label>
          <input
            type="number"
            id="duration-days"
            name="durationDays"
            min={1}
            defaultValue={initialQuest?.durationDays ?? 1}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="party-size">Partijgrootte</label>
          <input
            type="number"
            id="party-size"
            name="partySize"
            min={1}
            defaultValue={initialQuest?.partySize ?? 4}
            required
          />
          <p className="form-help">Inclusief de leider.</p>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="modal-actions">
        <Button type="submit">
          {isEditing ? "Wijzigingen opslaan" : "Quest plaatsen"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuleren
        </Button>
      </div>
    </form>
  );
}

export default QuestForm;
