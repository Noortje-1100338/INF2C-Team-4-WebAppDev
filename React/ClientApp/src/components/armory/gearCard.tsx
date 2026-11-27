import type { GearItem } from "../../services/gearRepository"
import Badge from "../ui/badge/badge"
import Card from "../ui/card/card"
import "./gearCard.css"
import PlaceholderImage from "../ui/placeholderImage/placeholderImage"
import { Link } from "react-router"

interface GearCardProps {
    gear: GearItem;
}

function GearCard({ gear }: GearCardProps) {
    const isOnLoan = gear.loanedTo !== null;
    const isAvailable = !gear.retired && !isOnLoan;

    return (
        <Card className={`gear-card${isAvailable? "" : " gear-card--unavailable"}`}>
            <div className="gear-card-top">
                <span className="gear-card-label">
                    {gear.kind}
                </span>

                <span className="gear-card-column-badge">
                    {gear.dangerous ? ( 
                        <Badge variant="danger">Gevaarlijk</Badge>
                    ) : (
                        <Badge>Veilig</Badge>
                    )}
                </span>
            </div>

            <div className="gear-card-content">
                <div className="gear-card-title-row">
                    <h3 className="gear-card-title">{gear.name}</h3>

                    <span className="gear-card-row-badge">
                        {gear.dangerous ? (
                            <Badge variant="danger">Gevaarlijk</Badge>
                        ) : (
                            <Badge>Veilig</Badge>
                        )}
                    </span>
                </div>
            </div>

            <div className="gear-card-image">
                <PlaceholderImage src={gear.imageUrl} alt={`Afbeelding van ${gear.name}`} />
            </div>

            <dl className="gear-card-facts">
                <div className="gear-card-fact">
                    <dt>Toestand</dt>
                    <dd>{gear.condition}</dd>
                </div>
                <div className="gear-card-fact gear-card-fact-end">
                    <dt>Status</dt>
                    <dd>{gear.retired ? "Buiten dienst" : isOnLoan ? "Uitgeleend" : "Beschikbaar"}</dd>
                </div>
            </dl>
            <Link className="gear-card-action" to={`/armory/${gear.id}`}>
                Bekijk details
            </Link>
        </Card>
    )
}

export default GearCard;