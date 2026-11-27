export interface GearItem {
    id: number;
    name: string;
    kind: string;
    condition: string;
    description: string;
    dangerous: boolean;
    retired: boolean;
    loanedTo: string | null;
    imageUrl?: string;
    loanedToMemberId: number | null;
    activeLoanId: number | null;
}

export interface CreateGearItemRequest {
    name: string;
    kind: string; 
    condition: string;
    description: string;
    dangerous: boolean;
    imageUrl?: string;
}


const API_BASE = '/api/gearItem';

export async function getGearItems(): Promise<GearItem[]> {
    const res = await fetch (API_BASE, { credentials: 'include' });
    if (!res.ok) throw new Error ('Failed to fetch gear items');
    return res.json();
}

export async function getGearItem(id: number): Promise<GearItem | null> {
    const res = await fetch(`${API_BASE}/${id}`, { credentials: 'include' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch gear item');
    return res.json();
}

export async function saveGearItem(request: CreateGearItemRequest): Promise<GearItem> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(request)
    });
    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Failed to save gear item');
    } 
    return res.json();
}