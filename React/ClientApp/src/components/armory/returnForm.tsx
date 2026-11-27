import { useState } from "react";
import Button from "../ui/button/button";
import { returnLoan, type Loan } from "../../services/loanRepository";
import useToast from "../../hooks/useToast";
import "./gearForm.css";

interface ReturnFormProps {
    loanId: number;
    onCancel: () => void;
    onReturned: (loan: Loan) => void;
}

function ReturnForm({ loanId, onCancel, onReturned }: ReturnFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            setIsLoading(true);
            const loan = await returnLoan(loanId, String(formData.get("conditionNote")).trim());
            showToast({ type: "success", title: "Uitrusting ingeleverd"  });
            onReturned(loan);
        } catch (error) {
            showToast({ type: "error", title: "Inleveren mislukt", message: error instanceof Error ? error.message : undefined });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="gear-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="conditionNote">Toestand bij het inleveren</label>
                <textarea id="conditionNote" name="conditionNote" placeholder="Bijvoorbeeld: punt van zwart kapot" required></textarea>
                <p className="form-help">Deze notitie is voor het volgende lid dat de uitrusting leent.</p>
            </div>

            <div className="modal-actions">
                <Button type="submit" loading={isLoading}>Inleveren</Button>
                <Button type="button" variant="secondary" onClick={onCancel}>Annuleren</Button>
            </div>
        </form>
    )
}

export default ReturnForm;