export interface Loan {
    id: number;
    gearId: number;
    gearName: string;
    memberId: number;
    memberName: string;
    startDate: string;
    dueDate: string;
    returnedAt: string | null;
}

export interface CreateLoanRequest {
    gearId: number;
    dueDate: string;
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