import { useState } from "react";
import Button from "../ui/button/button";
import {
  questCreatures,
  questMembers,
  type Quest,
  type QuestMember,
} from "../../services/questRepository";
import "./questOverview.css";

interface QuestOverviewProps {
  quests: Quest[];
  currentMember: QuestMember;
  onRequest: (questId: string) => void;
  onConfirm: (questId: string, requestId: string) => void;
  onEdit: (quest: Quest) => void;
  onCancelQuest: (quest: Quest) => void;
  onTransfer: (questId: string, memberId: string) => void;
}

interface QuestCardProps {
  quest: Quest;
  currentMember: QuestMember;
  today: string;
  onRequest: (questId: string) => void;
  onConfirm: (questId: string, requestId: string) => void;
  onEdit: (quest: Quest) => void;
  onCancelQuest: (quest: Quest) => void;
  onTransfer: (questId: string, memberId: string) => void;
}

function getCreature(creatureId: string | null) {
  return questCreatures.find((creature) => creature.id === creatureId);
}

function getLocalToday(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getAvailableMembers(quest: Quest): QuestMember[] {
  return quest.requests
    .filter((request) => request.confirmed)
    .map((request) =>
      questMembers.find((member) => member.id === request.memberId),
    )
    .filter((member): member is QuestMember => member !== undefined);
}

function QuestCard({
  quest,
  currentMember,
  today,
  onRequest,
  onConfirm,
  onEdit,
  onCancelQuest,
  onTransfer,
}: QuestCardProps) {
  const [transferTarget, setTransferTarget] = useState("");
  const leader = questMembers.find((member) => member.id === quest.leaderId);
  const creature = getCreature(quest.creatureId);
  const confirmedRequests = quest.requests.filter(
    (request) => request.confirmed,
  );
  const currentRequest = quest.requests.find(
    (request) => request.memberId === currentMember.id,
  );
  const isLeader = quest.leaderId === currentMember.id;
  const hasDeparted = quest.departureDate <= today;
  const canRequest =
    !isLeader && !currentRequest && !quest.cancelled && !hasDeparted;
  const canConfirm =
    isLeader &&
    !quest.cancelled &&
    !hasDeparted &&
    confirmedRequests.length + 1 < quest.partySize;
  const availableMembers = getAvailableMembers(quest);
  const departure = new Date(`${quest.departureDate}T00:00:00`);
  const returnDate = new Date(departure);
  returnDate.setDate(returnDate.getDate() + quest.durationDays);

  function handleTransfer(): void {
    if (!transferTarget) {
      return;
    }
    onTransfer(quest.id, transferTarget);
    setTransferTarget("");
  }

  return (
    <article
      className={`quest-card${quest.cancelled ? " quest-card-cancelled" : ""}`}
    >
      <div className="quest-card-title">
        <h3>{quest.village}</h3>
        {quest.cancelled && (
          <span className="quest-status cancelled">Geannuleerd</span>
        )}
      </div>
      <p>{quest.areaDescription}</p>
      {creature && (
        <p>
          Wezen: {creature.name} ({creature.region})
          {creature.dangerous && " - Gevaarlijk"}
        </p>
      )}
      <p>Vertrek: {formatDate(departure)}</p>
      <p>
        Verwachte terugkomst: {formatDate(returnDate)} ({quest.durationDays}{" "}
        dagen)
      </p>
      <p>
        Plekken: {confirmedRequests.length + 1} van {quest.partySize} bezet
      </p>
      <p>
        Leider: {leader?.name ?? "Onbekend"}
        {leader?.trained ? " (getraind)" : ""}
      </p>
      <p>
        Status:{" "}
        {quest.cancelled
          ? "Geannuleerd"
          : creature?.dangerous
            ? "Gevaarlijke quest"
            : "Reguliere quest"}
      </p>

      {isLeader && (
        <div className="quest-requests">
          <h4>Aanvragen</h4>
          {quest.requests.length === 0 ? (
            <p>Er zijn nog geen aanvragen.</p>
          ) : (
            <ul>
              {quest.requests.map((request) => {
                const member = questMembers.find(
                  (candidate) => candidate.id === request.memberId,
                );
                const canJoin =
                  !creature?.dangerous || Boolean(member?.trained);

                return (
                  <li key={request.id}>
                    <span>
                      {member?.name ?? "Onbekend lid"}
                      {member?.trained ? " (getraind)" : ""}:{" "}
                      {request.confirmed ? "Bevestigd" : "Aanvraag"}
                    </span>
                    {!request.confirmed && canConfirm && (
                      <Button
                        size="small"
                        onClick={() => onConfirm(quest.id, request.id)}
                        disabled={!canJoin}
                      >
                        Bevestigen
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {!isLeader && currentRequest && !quest.cancelled && (
        <p className="quest-request-status" role="status">
          {currentRequest.confirmed
            ? "Je plek is bevestigd."
            : hasDeparted
              ? "Je aanvraag is niet voor vertrek bevestigd; je blijft thuis."
              : "Je aanvraag wacht op bevestiging van de leider."}
        </p>
      )}
      {canRequest && (
        <Button onClick={() => onRequest(quest.id)}>Vraag een plek aan</Button>
      )}

      {isLeader && !quest.cancelled && (
        <div className="quest-leader-actions">
          <Button variant="secondary" onClick={() => onEdit(quest)}>
            Quest wijzigen
          </Button>
          <Button variant="danger" onClick={() => onCancelQuest(quest)}>
            Quest annuleren
          </Button>
          {availableMembers.length > 0 && (
            <div className="quest-transfer">
              <label htmlFor={`transfer-${quest.id}`}>
                Leiderschap overdragen
              </label>
              <div>
                <select
                  id={`transfer-${quest.id}`}
                  value={transferTarget}
                  onChange={(event) => setTransferTarget(event.target.value)}
                >
                  <option value="">Kies een bevestigd lid</option>
                  {availableMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                <Button
                  size="small"
                  disabled={!transferTarget}
                  onClick={handleTransfer}
                >
                  Overdragen
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function QuestOverview({
  quests,
  currentMember,
  onRequest,
  onConfirm,
  onEdit,
  onCancelQuest,
  onTransfer,
}: QuestOverviewProps) {
  const [questFilter, setQuestFilter] = useState<"all" | "mine">("all");
  const today = getLocalToday();
  const visibleQuests =
    questFilter === "mine"
      ? quests.filter((quest) => quest.leaderId === currentMember.id)
      : quests;

  return (
    <section className="quest-overview" aria-labelledby="quest-overview-title">
      <div className="quest-overview-heading">
        <div>
          <p className="modal-eyebrow">Quest board</p>
          <h2 id="quest-overview-title">
            {questFilter === "mine" ? "Mijn quests" : "Alle quests"}
          </h2>
        </div>
      </div>

      <div className="quest-filters" aria-label="Filter quests">
        <Button
          size="small"
          variant={questFilter === "all" ? "primary" : "secondary"}
          aria-pressed={questFilter === "all"}
          onClick={() => setQuestFilter("all")}
        >
          Alle quests
        </Button>
        <Button
          size="small"
          variant={questFilter === "mine" ? "primary" : "secondary"}
          aria-pressed={questFilter === "mine"}
          onClick={() => setQuestFilter("mine")}
        >
          Mijn quests
        </Button>
      </div>

      {visibleQuests.length === 0 ? (
        <p className="quest-empty">
          {questFilter === "mine"
            ? "Je hebt nog geen quests geplaatst."
            : "Er zijn nog geen quests geplaatst."}
        </p>
      ) : (
        <div className="quest-grid">
          {visibleQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              currentMember={currentMember}
              today={today}
              onRequest={onRequest}
              onConfirm={onConfirm}
              onEdit={onEdit}
              onCancelQuest={onCancelQuest}
              onTransfer={onTransfer}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default QuestOverview;
