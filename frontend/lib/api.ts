import { Meeting } from './types';
const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export async function getMeetings(query=''): Promise<Meeting[]> { const r=await fetch(`${base}/meetings?search=${encodeURIComponent(query)}`,{cache:'no-store'}); if(!r.ok) throw Error('Could not load meetings'); return r.json(); }
export async function getMeeting(id:string): Promise<Meeting> { const r=await fetch(`${base}/meetings/${id}`,{cache:'no-store'}); if(!r.ok) throw Error('Could not load meeting'); return r.json(); }
export { base };
