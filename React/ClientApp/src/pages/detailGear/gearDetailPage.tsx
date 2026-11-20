import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Modal from "../../components/ui/modal/modal";
import useModal from "../../hooks/useModal";
import LoanForm from "../../components/armory/loanForm";
import GearDetailHeader from "../../components/armory/detail/gearDetailHeader";
import GearDetailImage from "../../components/armory/detail/gearDetailImage";
import GearDetailInfo from "../../components/armory/detail/gearDetailInfo";
import GearDetailTabs from "../../components/armory/detail/gearDetailTabs";
import { getGearItem, type GearItem } from "../../services/gearRepository";
import "./gearDetailPage.css";

function GearDetailPage() {
    const { id } = useParams();
    const { isOpen, openModal, closeModal } = useModal();
    const [gear, setGear] = useState<GearItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    function handleLoaned() {
        closeModal();
        getGearItem(Number(id)).then(setGear).catch(() => {});
    }

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
                <GearDetailInfo gear={gear} onLoanClick={openModal} />
            </div>
            <GearDetailTabs />

            <Modal isOpen={isOpen}
                onClose={closeModal}
                eyebrow="Uitrusting"
                title="Uitrusting lenen"
            >
                <LoanForm gearId={Number(id)} onCancel={closeModal} onLoaned={handleLoaned} />
            </Modal>
        </main>
    )
}

export default GearDetailPage;