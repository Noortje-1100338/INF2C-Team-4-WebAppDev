// slaat 1 ontmoeting op
export interface Encounter {
    id: string;
    creature: string;
    outcome: string;
}

// Slaat 1 rapport op
export interface Report {
    id: string;
    region: string;
    departureDate: string;
    description: string;
    status: "draft" | "filed";
    writtenBy?: string;
    encounters: Encounter[];

}