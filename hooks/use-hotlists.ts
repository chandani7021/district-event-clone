import { useState, useEffect } from 'react';
import {
  getHotlists,
  addHotlist as addHotlistToStore,
  subscribeToHotlists,
  type Hotlist,
} from '@/store/hotlist-store';

export function useHotlists() {
  const [hotlists, setHotlists] = useState<Hotlist[]>(getHotlists());

  useEffect(() => {
    return subscribeToHotlists(() => setHotlists(getHotlists()));
  }, []);

  return {
    hotlists,
    addHotlist: (name: string) => addHotlistToStore(name),
  };
}
