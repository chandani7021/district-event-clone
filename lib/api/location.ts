import { API_BASE_URL } from '@/constants/api';
import { Landmark, Building2, Waves, TreePine, Star, Sun } from 'lucide-react-native';
import { City, DUMMY_CITIES } from '../dummy-locations';

const SIMULATED_DELAY = 1000;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}




export async function fetchPopularCities(): Promise<City[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/location/cities/popular/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    await delay(SIMULATED_DELAY);
    return DUMMY_CITIES;
  }
}
export { City };

