import { useState } from "react";
import Button from "../components/ui/button/button";
import Modal from "../components/ui/modal/modal";
import QuestForm from "../components/quest/questForm";
import QuestOverview from "../components/quest/questOverview";
import useModal from "../hooks/useModal";
import {
  getQuests,
  questCreatures,
  questMembers,
  saveQuests,
  type Quest,
  type QuestDetails,
} from "../services/questRepository";
import "./questPage.css";

// Geef datum als YYYY-MM-DD
function getLocalToday(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function findCreature(creatureId: string | null) {
  return questCreatures.find((creature) => creature.id === creatureId);
}

function loadInitialQuestState(): { quests: Quest[]; error: string } {
  try {
    return { quests: getQuests(), error: "" };
  } catch {
    return { quests: [], error: "De quests konden niet worden geladen." };
  }
}

function QuestPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const [questState, setQuestState] = useState(loadInitialQuestState);
  const [currentMemberId, setCurrentMemberId] = useState("member-7");
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [notice, setNotice] = useState("");
  const currentMember = questMembers.find(
    (member) => member.id === currentMemberId,
  );
  const quests = questState.quests;
  const loadError = questState.error;

  if (!currentMember) {
    return <main className="quest-page">Lid niet gevonden.</main>;
  }

  const activeMember = currentMember;

  function updateQuests(newQuests: Quest[]): string | null {
    try {
      saveQuests(newQuests);
      setQuestState((current) => ({ ...current, quests: newQuests }));
      return null;
    } catch {
      return "Opslaan is niet gelukt.";
    }
  }

  function saveQuestChange(
    questId: string,
    updatedQuest: Quest,
    successMessage: string,
  ): string | null {
    const error = updateQuests(
      quests.map((quest) => (quest.id === questId ? updatedQuest : quest)),
    );
    setNotice(error ?? successMessage);
    return error;
  }

  function validateQuest(details: QuestDetails): string | null {
    const creature = findCreature(details.creatureId);

    if (details.creatureId && !creature) {
      return "Kies een wezen uit de bestiary.";
    }
    if (creature?.dangerous && !activeMember.trained) {
      return "Een getraind lid moet leiden bij een gevaarlijke quest.";
    }
    if (details.departureDate <= getLocalToday()) {
      return "De vertrekdatum moet later zijn dan vandaag.";
    }
    if (!details.village || !details.areaDescription) {
      return "Vul het dorp en de gebiedsbeschrijving in.";
    }

    if (editingQuest) {
      if (editingQuest.leaderId !== activeMember.id || editingQuest.cancelled) {
        return "Alleen de leider kan de quest wijzigen.";
      }

      const confirmedRequests = editingQuest.requests.filter(
        (request) => request.confirmed,
      );
      if (confirmedRequests.length + 1 > details.partySize) {
        return "De partijgrootte is te klein voor de bevestigde leden.";
      }
      if (
        creature?.dangerous &&
        confirmedRequests.some((request) => {
          const member = questMembers.find(
            (candidate) => candidate.id === request.memberId,
          );
          return !member?.trained;
        })
      ) {
        return "Een gevaarlijke quest kan alleen getrainde leden bevatten.";
      }
    }

    return null;
  }

  function saveQuest(details: QuestDetails): string | null {
    const validationError = validateQuest(details);
    if (validationError) {
      return validationError;
    }

    if (editingQuest) {
      const updatedQuest: Quest = { ...editingQuest, ...details };
      const error = updateQuests(
        quests.map((quest) =>
          quest.id === editingQuest.id ? updatedQuest : quest,
        ),
      );
      if (error) {
        return error;
      }
      setNotice("De quest is bijgewerkt.");
    } else {
      const newQuest: Quest = {
        id: crypto.randomUUID(),
        leaderId: activeMember.id,
        ...details,
        cancelled: false,
        requests: [],
      };
      const error = updateQuests([newQuest, ...quests]);
      if (error) {
        return error;
      }
      setNotice("De quest is geplaatst.");
    }

    setEditingQuest(null);
    closeModal();
    return null;
  }

  function openCreateModal(): void {
    setEditingQuest(null);
    openModal();
  }

  function closeQuestModal(): void {
    setEditingQuest(null);
    closeModal();
  }

  function editQuest(quest: Quest): void {
    if (quest.leaderId !== activeMember.id || quest.cancelled) {
      return;
    }
    setEditingQuest(quest);
    openModal();
  }

  // Aanvraag plek quest
  function requestPlace(questId: string): void {
    const quest = quests.find((item) => item.id === questId);
    if (!quest) {
      setNotice("Deze quest bestaat niet meer.");
      return;
    }
    if (quest.cancelled || quest.departureDate <= getLocalToday()) {
      setNotice("Je kunt geen plek meer aanvragen.");
      return;
    }
    if (quest.leaderId === activeMember.id) {
      setNotice("De leider kan geen plek aanvragen.");
      return;
    }
    if (
      quest.requests.some((request) => request.memberId === activeMember.id)
    ) {
      setNotice("Je hebt al een aanvraag ingediend.");
      return;
    }

    const updatedQuest: Quest = {
      ...quest,
      requests: [
        ...quest.requests,
        {
          id: crypto.randomUUID(),
          memberId: activeMember.id,
          confirmed: false,
        },
      ],
    };
    saveQuestChange(
      quest.id,
      updatedQuest,
      "Je aanvraag wacht op bevestiging van de leider.",
    );
  }

  // Goedkeuren van een aanvraag, controleer rechten en plekken
  function confirmRequest(questId: string, requestId: string): void {
    const quest = quests.find((item) => item.id === questId);
    const request = quest?.requests.find((item) => item.id === requestId);
    const requestedMember = questMembers.find(
      (member) => member.id === request?.memberId,
    );

    if (!quest || !request || !requestedMember) {
      setNotice("De aanvraag kon niet worden gevonden.");
      return;
    }
    if (quest.leaderId !== activeMember.id) {
      setNotice("Alleen de leider kan aanvragen bevestigen.");
      return;
    }
    if (quest.cancelled || quest.departureDate <= getLocalToday()) {
      setNotice("Aanvragen kunnen niet meer worden bevestigd.");
      return;
    }
    if (request.confirmed) {
      setNotice("Deze aanvraag is al bevestigd.");
      return;
    }

    const confirmedCount = quest.requests.filter(
      (item) => item.confirmed,
    ).length;
    const hasAvailablePlace = confirmedCount + 1 < quest.partySize;
    if (!hasAvailablePlace) {
      setNotice("De partij is vol.");
      return;
    }

    const creature = findCreature(quest.creatureId);
    if (creature?.dangerous && !requestedMember.trained) {
      setNotice("Bij een gevaarlijk wezen kunnen alleen getrainde leden mee.");
      return;
    }

    const updatedQuest: Quest = {
      ...quest,
      requests: quest.requests.map((item) =>
        item.id === requestId ? { ...item, confirmed: true } : item,
      ),
    };
    saveQuestChange(
      quest.id,
      updatedQuest,
      `${requestedMember.name} is bevestigd voor de quest.`,
    );
  }

  function cancelQuest(quest: Quest): void {
    if (quest.leaderId !== activeMember.id || quest.cancelled) {
      setNotice("Alleen de leider kan de quest annuleren.");
      return;
    }
    if (
      !window.confirm(
        `Weet je zeker dat je de quest in ${quest.village} wilt annuleren?`,
      )
    ) {
      return;
    }

    const updatedQuest = { ...quest, cancelled: true };
    saveQuestChange(quest.id, updatedQuest, "De quest is geannuleerd.");
  }

  // Leiderschap overdragen
  function transferLeadership(questId: string, newLeaderId: string): void {
    const quest = quests.find((item) => item.id === questId);
    if (!quest || quest.leaderId !== activeMember.id || quest.cancelled) {
      setNotice("Alleen de leider kan het leiderschap overdragen.");
      return;
    }

    const confirmedRequest = quest.requests.find(
      (request) => request.memberId === newLeaderId && request.confirmed,
    );
    if (!confirmedRequest) {
      setNotice("Kies een lid met een bevestigde plek.");
      return;
    }

    const newLeader = questMembers.find((member) => member.id === newLeaderId);
    if (!newLeader) {
      setNotice("Dit lid kon niet worden gevonden.");
      return;
    }

    const creature = findCreature(quest.creatureId);
    if (creature?.dangerous && !newLeader.trained) {
      setNotice("Alleen een getraind lid kan deze quest leiden.");
      return;
    }

    const updatedQuest: Quest = {
      ...quest,
      leaderId: newLeaderId,
      requests: quest.requests.map((request) =>
        request.id === confirmedRequest.id
          ? { ...request, memberId: activeMember.id }
          : request,
      ),
    };
    saveQuestChange(
      quest.id,
      updatedQuest,
      `Het leiderschap is overgedragen aan ${newLeader.name}.`,
    );
  }

  return (
    <main className="quest-page">
      <header className="quest-header">
        <div className="quest-heading-copy">
          <h1>Quest board</h1>
          <label htmlFor="demo-member">Lid</label>
          <select
            id="demo-member"
            value={currentMemberId}
            onChange={(event) => {
              setCurrentMemberId(event.target.value);
              setNotice("");
            }}
          >
            {questMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}{" "}
                {member.trained ? "(getraind)" : "(niet getraind)"}
              </option>
            ))}
          </select>
          <p>Ingelogd als {activeMember.name}.</p>
        </div>
        <Button onClick={openCreateModal}>Quest toevoegen</Button>
      </header>

      {loadError && (
        <p className="quest-notice quest-error" role="alert">
          {loadError}
        </p>
      )}
      {notice && (
        <p className="quest-notice" role="status">
          {notice}
        </p>
      )}

      <QuestOverview
        quests={quests}
        currentMember={activeMember}
        onRequest={requestPlace}
        onConfirm={confirmRequest}
        onEdit={editQuest}
        onCancelQuest={cancelQuest}
        onTransfer={transferLeadership}
      />

      <Modal
        isOpen={isOpen}
        onClose={closeQuestModal}
        eyebrow="Quest"
        title={editingQuest ? "Quest wijzigen" : "Quest toevoegen"}
      >
        <QuestForm
          key={editingQuest?.id ?? "new-quest"}
          member={activeMember}
          initialQuest={editingQuest ?? undefined}
          onSave={saveQuest}
          onCancel={closeQuestModal}
        />
      </Modal>
    </main>
  );
}

export default QuestPage;
