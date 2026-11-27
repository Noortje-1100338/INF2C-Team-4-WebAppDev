import { useState, useEffect } from "react";
import Button from "../ui/button/button";
import { createLoan, getLoanPolicy, type Loan } from "../../services/loanRepository";
import useToast from "../../hooks/useToast";
import "./gearForm.css"

interface LoanFormProps {
    gearId: number;
    onCancel: () => void;
    onLoaned: (loan: Loan) => void;
}

function LoanForm({ gearId, onCancel, onLoaned }: LoanFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const [dueDate, setDueDate] = useState<string | null>(null);

    useEffect(() => {
        getLoanPolicy()
            .then(policy => {
                const date = new Date();
                date.setDate(date.getDate() + policy.maxLoanDays);
                setDueDate(date.toLocaleDateString("nl-NL", { day: "numeric", month: "long" }));
            })
            .catch(() => setDueDate(null));
    }, []);
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setIsLoading(true);
            const loan = await createLoan({
                gearId,
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
            <p className="form-help">
                {dueDate ? `Je leent deze uitrusting tot ${dueDate}. Lever het op tijd in`
                : "Je leent deze uitrusting volgens de standaard leentermijn van het gilde"}
            </p>

            <div className="modal-actions">
                <Button type="submit" loading={isLoading}>Lenen</Button>
                <Button type="button" variant="secondary" onClick={onCancel}>Annuleren</Button>
            </div>
        </form>
    )
}

export default LoanForm;
