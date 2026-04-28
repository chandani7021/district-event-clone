export interface HotlistItem {
  id: string;
  title: string;
  coverImage: string;
  subtitle: string;
  dateAdded: string;
  happeningDate: string;
}

export interface Hotlist {
  id: string;
  name: string;
  isStarter?: boolean;
  gradientColors: string[];
  iconType: 'heart' | 'sparkle';
  itemCount: number;
  items?: HotlistItem[];
}

export interface AddToHotlistParams {
  hotlistId: string;
  itemId: string;
  itemTitle: string;
  itemCoverImage?: string;
  happeningDate?: string;
}

export interface HotlistPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  eventTitle?: string;
  eventId?: string;
  eventCoverImage?: string;
}

export interface HotlistRowProps {
  hotlist: Hotlist;
  onAdd: () => void;
  onAdded: () => void;
}
