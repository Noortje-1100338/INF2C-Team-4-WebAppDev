import type { GearItem } from "../../../services/gearRepository";
import "./gearDetailInfo.css";
import Button from "../../ui/button/button";
import { ArrowRight, ShieldCheck, ShieldAlert} from "lucide-react";
import { useAuthContext } from "../../../context/authContext";

interface GearDetailInfoProps {
    gear: GearItem;
    onLoanClick: () => void;
    onReturnClick: () => void;
}


const conditionLabels: Record<string, string> = {
    new: "Nieuw",
    good: "Goed",
    worn: "Versleten",
    damaged: "Beschadigd",
}

function GearDetailInfo({ gear, onLoanClick, onReturnClick }: GearDetailInfoProps) {
    const { user } = useAuthContext();
    const isOnLoan = gear.loanedTo != null;
    const mayReturn = isOnLoan && (gear.loanedToMemberId === user?.id || user?.quartermaster === true);
    const needsTraining = gear.dangerous && !user?.trained;

    return (
        <section className="gear-detail-info" aria-labelledby="gear-detail-info-title">
            <h2 id="gear-detail-info-title">Gegevens</h2>

            <dl className="gear-detail-facts">
                <div className="gear-detail-fact">
                    <dt>Soort</dt>
                    <dd>{gear.kind}</dd>
                </div>

                <div className="gear-detail-fact">
                    <dt>Toestand</dt>
                    <dd>{conditionLabels[gear.condition] ?? gear.condition}</dd>
                </div>

                <div className="gear-detail-fact">
                    <dt>Status</dt>
                    <dd>{gear.retired ? "Buiten dienst" : "Beschikbaar"}</dd>
                </div>

                <div className="gear-detail-fact">
                    {/* LoanedTo is null als niemand een item heeft geleend is nu hardcoded*/}
                    <dt>Uitgeleend aan</dt>
                    <dd>{gear.loanedTo ?? "Niet uitgeleend"}</dd>
                </div>

                <div className="gear-detail-fact">
                    <dt>Uit gebruik</dt>
                    <dd>{gear.retired ? "Ja" : "Nee"}</dd>
                </div>
            </dl>

            <div className="gear-detail-training">
                <div className="gear-detail-training-content">
                    {needsTraining
                        ? <ShieldAlert className="gear-detail-training-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
                        : <ShieldCheck className="gear-detail-training-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
                    }
                    <div className="gear-detail-training-text">
                        <div className="gear-detail-training-title">
                            <h3>{gear.dangerous ? "Training vereist" : "Geen training vereist"}</h3>
                        </div>

                        <div className="gear-detail-training-description">
                            <p> {!gear.dangerous ? "Deze uitrusting kan zonder training gebruikt worden." : needsTraining ? "Je bent nog niet getraind. Volg eerst een drill in de yard."
                            : "Je bent getraind en mag deze uitrusting lenen"}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="gear-detail-loan">
                {mayReturn ? (
                    <Button type="button" variant="secondary" fullWidth className="gear-detail-loan-button" onClick={onReturnClick}>
                        <span>Uitrusting Inleveren</span>
                        <ArrowRight className="gear-detail-loan-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
                    </Button>
                ) : (
                    <Button type="button" variant="primary" fullWidth className="gear-detail-loan-button" onClick={onLoanClick} disabled={gear.retired || gear.loanedTo !== null || needsTraining}>
                        <span>Uitrusting Lenen</span>
                        <ArrowRight className="gear-detail-loan-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
                    </Button>
                )}
            </div>


        </section>
    )
}

export default GearDetailInfo;