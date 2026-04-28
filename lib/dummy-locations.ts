export interface City {
  id: string;
  name: string;
  Icon: React.ComponentType<any>;
}
import { Landmark, Building2, Waves, TreePine, Star, Sun } from 'lucide-react-native';

export const DUMMY_CITIES: City[] = [
  { id: 'delhi',      name: 'Delhi NCR',  Icon: Landmark  },
  { id: 'mumbai',     name: 'Mumbai',     Icon: Waves     },
  { id: 'kolkata',    name: 'Kolkata',    Icon: Building2 },
  { id: 'bengaluru',  name: 'Bengaluru',  Icon: TreePine  },
  { id: 'hyderabad',  name: 'Hyderabad',  Icon: Star      },
  { id: 'chandigarh', name: 'Chandigarh', Icon: Sun       },
];