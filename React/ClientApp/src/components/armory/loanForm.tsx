import { useState } from "react";
import Button from "../ui/button/button";
import { createLoan, type Loan } from "../../services/loanRepository";
import useToats from "../../hooks/useToast";
import "./gearForm.css"

interface LoanFormProps {
    gearId: number;
    onCancel: () => void;
    onLoaned: (loan: Loan) => void;
}

function LoanForm({ gearId, onCancel, onLoaned }: LoanFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToats();

    const tomorrow = new Date(Date.now() + 864000000).toISOString().slice(0, 10);
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            setIsLoading(true);
            const loan = await createLoan({
                gearId,
                dueDate: new Date(String(formData.get("dueDate"))).toISOString()
            });
            showToast({ type: "success", title: "Uitrusting geleend"});
            onLoaned(loan);
        } catch (error) {
            showToast({ type: "error", title: "Lenen mislukt", message: error instanceof Error ? error.message : undefined})
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="gear-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="dueDate">Inleverdatum</label>
                <input type="date" id="dueDate" name="dueDate" min={tomorrow} defaultValue={tomorrow} required />
            </div>

            <div className="modal-actions">
                <Button type="submit" loading={isLoading}>Lenen</Button>
                <Button type="button" variant="secondary" onClick={onCancel}>Annuleren</Button>
            </div>
        </form>
    )
}

export default LoanForm;
