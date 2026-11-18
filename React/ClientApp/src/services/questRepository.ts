export interface QuestMember {
  id: number;
  name: string;
  trained: boolean;
}

export interface QuestCreature {
  id: number;
  name: string;
  region: string;
  dangerous: boolean;
}

export interface QuestRequest {
  id: number;
  memberId: number;
  confirmed: boolean;
}

export interface Quest {
  id: number;
  leaderId: number;
  village: string;
  areaDescription: string;
  creatureId: number | null;
  departureDate: string;
  durationDays: number;
  partySize: number;
  cancelled: boolean;
  requests: QuestRequest[];
}

export interface QuestDetails {
  village: string;
  areaDescription: string;
  creatureId: number | null;
  departureDate: string;
  durationDays: number;
  partySize: number;
}

export const questMembers: QuestMember[] = [
  { id: 7, name: "7", trained: true },
  { id: 12, name: "12", trained: true },
  { id: 3, name: "3", trained: false },
  { id: 1, name: "1", trained: false },
  { id: 9, name: "9", trained: true },
];

export const questCreatures: QuestCreature[] = [
  { id: 1, name: "Zombie", region: "Swamp", dangerous: true },
  { id: 2, name: "Creeper", region: "Forest", dangerous: true },
  { id: 3, name: "Skeleton", region: "Plains", dangerous: true },
  {
    id: 4,
    name: "Spider",
    region: "Cave",
    dangerous: true,
  },
  {
    id: 5,
    name: "Enderman",
    region: "End",
    dangerous: true,
  },
];

export async function fetchQuests(): Promise<Quest[]> {
  const response = await fetch("/api/quest");
  if (!response.ok) {
    throw new Error("Failed to fetch quests");
  }
  return response.json() as Promise<Quest[]>;
}

const storageKey = "quests";

function dateFromNow(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getExampleQuests(): Quest[] {
  return [
    {
      id: 1,
      leaderId: 7,
      village: "Oak",
      areaDescription: "Zoek de zombie bij het moeras.",
      creatureId: 1,
      departureDate: dateFromNow(5),
      durationDays: 2,
      partySize: 4,
      cancelled: false,
      requests: [
        { id: 1, memberId: 12, confirmed: true },
        { id: 2, memberId: 9, confirmed: false },
      ],
    },
    {
      id: 2,
      leaderId: 3,
      village: "Spruce",
      areaDescription: "Zoek de kist in de grot.",
      creatureId: null,
      departureDate: dateFromNow(10),
      durationDays: 3,
      partySize: 5,
      cancelled: false,
      requests: [{ id: 3, memberId: 1, confirmed: false }],
    },
  ];
}

function isQuest(value: unknown): value is Quest {
  if (typeof value !== "object" || value === null) return false;
  const quest = value as Partial<Quest>;
  return (
    typeof quest.id === "number" &&
    typeof quest.leaderId === "number" &&
    typeof quest.village === "string" &&
    typeof quest.areaDescription === "string" &&
    (typeof quest.creatureId === "number" || quest.creatureId === null) &&
    typeof quest.departureDate === "string" &&
    typeof quest.durationDays === "number" &&
    typeof quest.partySize === "number" &&
    typeof quest.cancelled === "boolean" &&
    Array.isArray(quest.requests) &&
    quest.requests.every(
      (request) =>
        typeof request.id === "number" &&
        typeof request.memberId === "number" &&
        typeof request.confirmed === "boolean",
    )
  );
}

export function getQuests(): Quest[] {
  const storedQuests = localStorage.getItem(storageKey);
  if (storedQuests === null) return getExampleQuests();

  const parsed: unknown = JSON.parse(storedQuests);
  if (!Array.isArray(parsed) || !parsed.every(isQuest)) {
    throw new Error("De opgeslagen questgegevens zijn ongeldig.");
  }

  const exampleQuests = getExampleQuests();
  let updatedExamples = false;
  const quests = parsed.map((quest) => {
    const example = exampleQuests.find(({ id }) => id === quest.id);
    if (!example) return quest;

    const updatedQuest = {
      ...quest,
      village: example.village,
      areaDescription: example.areaDescription,
      creatureId: example.creatureId,
    };
    if (
      quest.village !== updatedQuest.village ||
      quest.areaDescription !== updatedQuest.areaDescription ||
      quest.creatureId !== updatedQuest.creatureId
    ) {
      updatedExamples = true;
    }
    return updatedQuest;
  });

  if (updatedExamples) {
    localStorage.setItem(storageKey, JSON.stringify(quests));
  }
  return quests;
}

export function saveQuests(quests: Quest[]): void {
  localStorage.setItem(storageKey, JSON.stringify(quests));
}
