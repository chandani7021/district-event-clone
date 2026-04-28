import { API_BASE_URL } from '@/constants/api';
import type { Hotlist, AddToHotlistParams } from '@/interfaces/hotlist.interface';
import { getHotlists, addHotlist as addHotlistToStore } from '@/store/hotlist-store';

export async function fetchHotlists(): Promise<Hotlist[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/hotlists`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return getHotlists();
  }
}

export async function addItemToHotlist(params: AddToHotlistParams): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/hotlists/${params.hotlistId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch {
    // API unavailable — item display handled locally via store
  }
}

export async function createHotlist(name: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/hotlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error();
  } catch {
    addHotlistToStore(name);
  }
}
