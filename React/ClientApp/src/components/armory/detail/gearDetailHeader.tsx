import { Link } from "react-router";
import type { GearItem } from "../../../services/gearRepository";
import Badge from "../../ui/badge/badge";
import "./gearDetailHeader.css";
import { ArrowLeft } from "lucide-react";

interface GearDetailHeaderProps {
    gear: GearItem;
    description: string;
}

function GearDetailHeader({
    gear,
    description,
}: GearDetailHeaderProps) {
    return (
        <header className="gear-detail-header">
            <div className="gear-detail-navigation">
                <Link className="gear-detail-back-link" to="/armory">
                    <ArrowLeft className="gear-detail-back-icon" size={14} strokeWidth={1.8} aria-hidden="true" />
                    <span> Uitrusting</span>
                </Link>
                <nav className="gear-detail-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Hollowmere</Link>
                    <span aria-hidden="true">/</span>
                    <Link to="/armory">Armory</Link>
                </nav>
            </div>

            <div className="gear-detail-heading">
                <div className="gear-detail-title-row">
                    <div className="gear-detail-title">
                        <h1>{gear.name}</h1>
                    </div>
                    
                    <div className="gear-detail-status">
                        {gear.dangerous ? (
                            <Badge variant="danger">Gevaarlijk</Badge>
                        ) : (
                            <Badge>Veilig</Badge>
                        )}
                    </div>
                </div>
                <p className="gear-detail-description">{description}</p>
            </div>
        </header>
    )
}

export default GearDetailHeader;