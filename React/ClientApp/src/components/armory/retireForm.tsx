import { useState } from "react";
import Button from "../ui/button/button";
import { retireGearItem, type GearItem } from "../../services/gearRepository";
import useToast from "../../hooks/useToast";
import "./gearForm.css";

interface RetireFormProps {
    gearId: number;
    gearName: string;
    onCancel: () => void;
    onRetired: (gear: GearItem) => void;
}

function RetireForm({ gearId, gearName, onCancel, onRetired }: RetireFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setIsLoading(true);
            const gear = await retireGearItem(gearId);
            showToast({ type: "success", title: "Uitrusting buiten dienst gesteld"});
            onRetired(gear);
        } catch (error) {
            showToast({ type: "error", title: "Buiten dienst stellen mislukt", message: error instanceof Error ? error.message : undefined});
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="gear-form" onSubmit={handleSubmit}>
            <p>Je staat op het punt <strong>{gearName}</strong> buiten dienst te stellen.
            De uitrusting verdwijnt uit het overzicht van de leden en kan nooit meer geleend worden. Dit kan je niet ongedaan maken.</p>

            <div className="modal-actions">
                <Button type="submit" variant="danger" loading={isLoading}>Buiten dienst stellen</Button>
                <Button type="button" variant="secondary" onClick={onCancel}>Annuleren</Button>
            </div>
        </form>
    )
}

export default RetireForm;