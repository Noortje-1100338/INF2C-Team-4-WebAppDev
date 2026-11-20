import { useEffect, useState } from "react";
import { useParams } from "react-router";
import GearDetailHeader from "../../components/armory/detail/gearDetailHeader";
import GearDetailImage from "../../components/armory/detail/gearDetailImage";
import GearDetailInfo from "../../components/armory/detail/gearDetailInfo";
import GearDetailTabs from "../../components/armory/detail/gearDetailTabs";
import { getGearItem, type GearItem } from "../../services/gearRepository";
import "./gearDetailPage.css";

function GearDetailPage() {
    const { id } = useParams();
    const [gear, setGear] = useState<GearItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getGearItem(Number(id))
            .then(setGear)
            .catch(() => setGear(null))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) return <main><p>Loading...</p></main>

    if (!gear) {
        return <main><p>Uitrusting niet gevonden</p></main>
    }
    return (
        <main className="gear-detail-page">
            <GearDetailHeader gear={gear} description={gear.description} />
            
            <div className="gear-detail-content">
                <GearDetailImage gear={gear} />
                <GearDetailInfo gear={gear} />
            </div>
            <GearDetailTabs />
        </main>
    )
}

export default GearDetailPage;