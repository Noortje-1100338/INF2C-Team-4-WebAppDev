import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Modal from "../../components/ui/modal/modal";
import useModal from "../../hooks/useModal";
import LoanForm from "../../components/armory/loanForm";
import ReturnForm from "../../components/armory/returnForm";
import PageLoader from "../../components/ui/pageLoader/pageLoader";
import GearDetailHeader from "../../components/armory/detail/gearDetailHeader";
import GearDetailImage from "../../components/armory/detail/gearDetailImage";
import GearDetailInfo from "../../components/armory/detail/gearDetailInfo";
import GearDetailTabs from "../../components/armory/detail/gearDetailTabs";
import { getGearItem, type GearItem } from "../../services/gearRepository";
import RetireForm from "../../components/armory/retireForm";
import "./gearDetailPage.css";

function GearDetailPage() {
    const { id } = useParams();
    const loanModal = useModal();
    const returnModal = useModal();
    const retireModal = useModal();
    const [gear, setGear] = useState<GearItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    function refreshGear() {
        getGearItem(Number(id)).then(setGear).catch(() => {});
    }

    function handleLoaned() {
        loanModal.closeModal();
        refreshGear();
    }

    function handleReturned() {
        returnModal.closeModal();
        refreshGear();
    }

    function handleRetired() {
        retireModal.closeModal();
        refreshGear();
    }

    useEffect(() => {
        setIsLoading(true);
        getGearItem(Number(id))
            .then(setGear)
            .catch(() => setGear(null))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) return <PageLoader />;

    if (!gear) {
        return <main><p>Uitrusting niet gevonden</p></main>
    }
    return (
        <main className="gear-detail-page">
            <GearDetailHeader gear={gear} description={gear.description} />
            
            <div className="gear-detail-content">
                <GearDetailImage gear={gear} />
                <GearDetailInfo gear={gear} onLoanClick={loanModal.openModal} onReturnClick={returnModal.openModal} onRetireClick={retireModal.openModal} />
            </div>
            <GearDetailTabs />

            <Modal isOpen={loanModal.isOpen}
                onClose={loanModal.closeModal}
                eyebrow="Uitrusting"
                title="Uitrusting lenen"
            >
                <LoanForm gearId={Number(id)} onCancel={loanModal.closeModal} onLoaned={handleLoaned} />
            </Modal>

            {gear.activeLoanId !== null && (
                <Modal isOpen={returnModal.isOpen}
                    onClose={returnModal.closeModal}
                    eyebrow="Uitrusting"
                    title="Uitrusting inleveren">
                        <ReturnForm loanId={gear.activeLoanId} onCancel={returnModal.closeModal} onReturned={handleReturned} />
                    </Modal>
            )}

            <Modal isOpen={retireModal.isOpen}
                onClose={retireModal.closeModal}
                eyebrow="Uitrusting"
                title="Buiten dienst stellen">
                    <RetireForm gearId={gear.id} gearName={gear.name} onCancel={retireModal.closeModal} onRetired={handleRetired} />
                </Modal>
        </main>
    )
}

export default GearDetailPage;