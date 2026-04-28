export const HOTLIST_TITLE = 'Hotlists';
export const HOTLIST_ALL_HOTLISTS = 'All Hotlists';
export const HOTLIST_CREATE_NEW = '+ Create new';
export const HOTLIST_CREATE_BUTTON = 'Create Hotlist';
export const HOTLIST_CREATE_MODAL_TITLE = 'Create new';
export const HOTLIST_INPUT_PLACEHOLDER = 'Write Hotlist name here';
export const HOTLIST_CREATE_CONFIRM = 'Create';
export const HOTLIST_STARTER_LABEL = 'Starter list';
export const HOTLIST_ITEMS_LABEL = 'items';
export const HOTLIST_EMPTY_TITLE = 'Nothing hotlisted yet, let\'s get started';
export const HOTLIST_ADD_ITEMS = 'Add items';
export const HOTLIST_MANAGE = 'Manage';
export const PROFILE_HOTLISTS = 'Hotlists';

export const HOTLIST_SAVED = 'Saved';
export const HOTLIST_DEFAULT = 'Default Hotlist';
export const HOTLIST_CREATE_LINK = 'Create new';
export const HOTLIST_PICKER_TITLE = 'Hotlists';
export const HOTLIST_ITEM_SINGULAR = 'item';
export const HOTLIST_ITEM_PLURAL = 'items';
export const HOTLIST_ADDED = 'Added!';

export type HotlistSortOption = 'date-new' | 'date-old' | 'happening';

export const HOTLIST_SORT_OPTIONS: { id: HotlistSortOption; label: string }[] = [
  { id: 'date-new', label: 'Date Added: New to Old' },
  { id: 'date-old', label: 'Date Added: Old to New' },
  { id: 'happening', label: 'Happening: Now to Later' },
];
