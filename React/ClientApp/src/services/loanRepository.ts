export interface Loan {
    id: number;
    gearId: number;
    gearName: string;
    memberId: number;
    memberName: string;
    startDate: string;
    dueDate: string;
    returnedAt: string | null;
    conditionNote: string;
}

export interface CreateLoanRequest {
    gearId: number;
}

export interface LoanPolicy {
    maxLoanDays: number;
}

const API_BASE = '/api/loan';

export async function getLoans(): Promise<Loan[]> {
    const res = await fetch(API_BASE, { credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch loans: ${res.statusText}`);
    return res.json();
}

export async function createLoan(request: CreateLoanRequest): Promise<Loan> {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(request),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Lenen mislukt');
    }
    return res.json();
}

export async function returnLoan(id: number, conditionNote: string): Promise<Loan> {
    const res = await fetch(`${API_BASE}/${id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ conditionNote }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Inleveren mislukt');
    }
    return res.json();
}

export async function getLoanPolicy(): Promise<LoanPolicy> {
    const res = await fetch(`${API_BASE}/policy`, { credentials: 'include' });
    if (!res.ok) throw new Error(`Kon de lening policy niet ophalen: ${res.statusText}`);
    return res.json();
}