import Button from "../ui/button/button";
import { saveGearItem, type GearItem } from "../../services/gearRepository";
import "./gearForm.css";
import { useState } from "react";

interface GearFormProps {
    onCancel: () => void;
    onSaved: (item: GearItem) => void;
}

function GearForm({ onCancel, onSaved }: GearFormProps) {
    const [ imageUrl, setImageUrl ] = useState<string | undefined>(undefined);

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImageUrl(reader.result as string);
        reader.readAsDataURL(file);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const saved = await saveGearItem({
            name: String(formData.get("name")).trim(),
            kind: String(formData.get("kind")),
            condition: String(formData.get("condition")),
            description: String(formData.get("description")).trim(),
            dangerous: formData.get("dangerouss") === "on",
            imageUrl
        });
        onSaved(saved);
        event.currentTarget.reset();
        setImageUrl(undefined);

    }

    return (
        <form className="gear-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="gearName">Naam</label>
                <input type="text" id="gearName" name="name" placeholder="Naam van de uitrusting" required />
            </div>
            <div className="form-group">
                <label htmlFor="gearDescription">Beschrijving</label>
                <textarea id="gearDescription" name="description" placeholder="Beschrijving van de uitrusting" required></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="gearKind">Soort</label>
                <select id="gearKind" name="kind" defaultValue="" required>
                    <option value="">Kies een soort</option>
                    <option value="rope">Touw</option>
                    <option value="lantern">Lantaarn</option>
                    <option value="sword">Zwaard</option>
                    <option value="shield">Schild</option>
                    <option value="crossbow">Kruisboog</option>
                    <option value="lockpick">Sloten opener</option>
                    <option value="beartrap">Beerval</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="gearCondition">Toestand</label>
                <select id="gearCondition" name="condition" defaultValue="" required>
                    <option value="">Kies een toestand</option>
                    <option value="new">Nieuw</option>
                    <option value="good">Goed</option>
                    <option value="worn">Versleten</option>
                    <option value="damaged">Beschadigd</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="gearImage">Afbeelding</label>
                <input type="file" id="gearImage" name="image" accept="image/*" onChange={handleImageChange} />
                {imageUrl && <img src={imageUrl} alt="Preview" className="image-preview" />}
            </div>

            <fieldset className="checkbox-group">
                <legend>Eigenschappen</legend>

                <label className="checkbox-option" htmlFor="gearDangerous">
                    <input type="checkbox" id="gearDangerous" name="dangerous" />
                    Gevaarlijke uitruting
                </label>
                <p className="form-help">
                    Gevaarlijke uitrusting kan je alleen aan ervaren leden uitgeleend worden.
                </p>
            </fieldset>
            <div className="modal-actions">
                <Button type="submit">Opslaan</Button>
                <Button type ="button" variant="secondary" onClick={onCancel}>Annuleren</Button>
            </div>
        </form>
    )
}

export default GearForm;