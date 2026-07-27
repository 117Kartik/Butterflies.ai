const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export type WorkspaceUser = { id: string; full_name: string; email: string; password_hash: string; password_salt: string };

function headers(extra: Record<string,string> = {}) { if (!url || !anonKey || url.includes('your-project')) throw new Error('Add your Supabase URL and anon key to frontend/.env.local first.'); return { apikey: anonKey, Authorization: `Bearer ${anonKey}`, ...extra }; }
const encode = (data: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(data)));
function fallbackHash(value: string) { let hash=2166136261; for(let round=0;round<5000;round++) for(let i=0;i<value.length;i++){hash^=value.charCodeAt(i);hash=Math.imul(hash,16777619)} return `demo-${(hash>>>0).toString(16)}`; }
async function passwordHash(password: string, salt: string) { const subtle=globalThis.crypto?.subtle; if(!subtle)return fallbackHash(`${salt}:${password}`); const key=await subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']); return encode(await subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},key,256)); }
export async function createWorkspaceUser(full_name: string, email: string, password: string) {
  const random=globalThis.crypto?.getRandomValues?.(new Uint8Array(16)); const password_salt=random?encode(random):`${Date.now()}-${Math.random()}`; const password_hash=await passwordHash(password,password_salt);
  const response = await fetch(`${url}/rest/v1/workspace_users`, { method:'POST', headers: headers({ 'Content-Type':'application/json', Prefer:'return=representation' }), body: JSON.stringify({ full_name, email, password_hash, password_salt }) });
  if (!response.ok) { const data=await response.json(); throw new Error(data.message?.includes('duplicate') ? 'That email is already registered. Please sign in instead.' : data.message || 'Could not save your email.'); }
  const [user] = await response.json() as WorkspaceUser[]; localStorage.setItem('butterflies-user', JSON.stringify(user)); return user;
}
export async function findWorkspaceUser(email: string, password: string) {
  const response = await fetch(`${url}/rest/v1/workspace_users?select=id,full_name,email,password_hash,password_salt&email=eq.${encodeURIComponent(email)}`, { headers: headers() });
  if (!response.ok) throw new Error('Could not look up that email.'); const [user] = await response.json() as WorkspaceUser[];
  if (!user) throw new Error('No profile exists for that email. Please create an account first.'); if (await passwordHash(password,user.password_salt)!==user.password_hash) throw new Error('Incorrect password.'); localStorage.setItem('butterflies-user', JSON.stringify(user)); return user;
}
