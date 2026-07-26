const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type AuthResponse = { access_token?: string; user?: { email?: string; user_metadata?: { full_name?: string } }; error?: { message?: string } };

async function request(path: string, body: Record<string, unknown>): Promise<AuthResponse> {
  if (!url || !anonKey || url.includes('your-project')) throw new Error('Add your Supabase URL and anon key to frontend/.env.local first.');
  const response = await fetch(`${url}/auth/v1/${path}`, { method: 'POST', headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.msg || data?.error_description || data?.message || 'Authentication failed.');
  return data;
}
export async function signIn(email: string, password: string) { const data = await request('token?grant_type=password', { email, password }); if (data.access_token) localStorage.setItem('butterflies-session', data.access_token); localStorage.setItem('butterflies-user', data.user?.user_metadata?.full_name || data.user?.email || 'Aarav Kapoor'); return data; }
export async function signUp(name: string, email: string, password: string) { return request('signup', { email, password, data: { full_name: name } }); }
