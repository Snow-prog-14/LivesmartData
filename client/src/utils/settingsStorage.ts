export interface SettingItem {
  id: string;
  name: string;
  isActive: boolean;
}

export type SettingsGroup = 
  | 'programs' 
  | 'cityOfCamp' 
  | 'cityOfPreview' 
  | 'introductoryVenues' 
  | 'paymentModes' 
  | 'confirmationChannels' 
  | 'callStatuses';

const STORAGE_KEYS: Record<SettingsGroup, string> = {
  programs: 'livesmart_settings_programs',
  cityOfCamp: 'livesmart_settings_city_of_camp',
  cityOfPreview: 'livesmart_settings_city_of_preview',
  introductoryVenues: 'livesmart_settings_introductory_venues',
  paymentModes: 'livesmart_settings_payment_modes',
  confirmationChannels: 'livesmart_settings_confirmation_channels',
  callStatuses: 'livesmart_settings_call_statuses'
};

const DEFAULT_VALUES: Record<SettingsGroup, string[]> = {
  programs: ['Leadership Camp', 'Youth Camp', 'Summer Camp'],
  cityOfCamp: ['Batangas', 'Tagaytay', 'Baguio'],
  cityOfPreview: ['Manila', 'Quezon City', 'Makati'],
  introductoryVenues: ['Main Office', 'School Auditorium', 'Online Preview'],
  paymentModes: ['Cash', 'GCash', 'Bank Transfer', 'Credit Card', 'Other'],
  confirmationChannels: ['Call', 'SMS', 'Viber', 'Email', 'In Person'],
  callStatuses: ['Answered', 'No Answer', 'Unreachable', 'Call Back', 'Cancelled']
};

export const getSettings = (group: SettingsGroup): SettingItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS[group]);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(`Failed to parse settings for ${group}`, e);
    }
  }

  // If no data, return defaults
  const defaults = DEFAULT_VALUES[group].map((name, index) => ({
    id: `${group}-${index}-${Date.now()}`,
    name,
    isActive: true
  }));
  
  saveSettings(group, defaults);
  return defaults;
};

export const saveSettings = (group: SettingsGroup, items: SettingItem[]): void => {
  localStorage.setItem(STORAGE_KEYS[group], JSON.stringify(items));
};

export const addSettingItem = (group: SettingsGroup, name: string): SettingItem[] => {
  const items = getSettings(group);
  
  // Validation should be handled in UI, but safe check here
  if (items.some(item => item.name.toLowerCase() === name.toLowerCase())) {
    return items;
  }

  const newItem: SettingItem = {
    id: `${group}-${Date.now()}`,
    name,
    isActive: true
  };

  const updated = [...items, newItem];
  saveSettings(group, updated);
  return updated;
};

export const toggleSettingItem = (group: SettingsGroup, id: string): SettingItem[] => {
  const items = getSettings(group);
  const updated = items.map(item => 
    item.id === id ? { ...item, isActive: !item.isActive } : item
  );
  saveSettings(group, updated);
  return updated;
};

export const deleteSettingItem = (group: SettingsGroup, id: string): SettingItem[] => {
  const items = getSettings(group);
  const updated = items.filter(item => item.id !== id);
  saveSettings(group, updated);
  return updated;
};
