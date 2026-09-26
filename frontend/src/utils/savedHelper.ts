import { savedApi } from '../services/api';

const LOCAL_STORAGE_KEY = 'the_marketplace_saved_items_v2';

export interface SavedItemData {
  id: string;
  entityType: 'service' | 'job' | 'idea' | 'course' | 'profile' | 'quick_work' | 'urgent_work' | 'physical_project' | 'local_worker';
  entityId: string;
  title: string;
  summary?: string;
  price?: number;
  category?: string;
  creatorName?: string;
  createdAt?: string;
  link: string;
  raw?: any;
}

export const getLocalSavedItems = (): SavedItemData[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const setLocalSavedItems = (items: SavedItemData[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('saved_items_updated'));
  } catch (e) {
    console.error(e);
  }
};

export const isItemSaved = (entityType: string, entityId: string): boolean => {
  const items = getLocalSavedItems();
  return items.some(item => item.entityType === entityType && item.entityId === entityId);
};

export const toggleSaveItem = async (
  entityType: 'service' | 'job' | 'idea' | 'course' | 'profile' | 'quick_work' | 'urgent_work' | 'physical_project' | 'local_worker',
  entityId: string,
  itemData?: { title: string; summary?: string; price?: number; category?: string; creatorName?: string; link?: string; raw?: any }
): Promise<boolean> => {
  const current = getLocalSavedItems();
  const index = current.findIndex(i => i.entityType === entityType && i.entityId === entityId);

  if (index >= 0) {
    // Already saved -> UNSAVE IT
    current.splice(index, 1);
    setLocalSavedItems(current);

    try {
      await savedApi.unsave(entityType, entityId);
    } catch (e) {
      console.warn('API unsave silent fallback', e);
    }
    return false; // Now unsaved
  } else {
    // Not saved -> SAVE IT
    const newItem: SavedItemData = {
      id: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      entityType,
      entityId,
      title: itemData?.title || 'Saved Item',
      summary: itemData?.summary || '',
      price: itemData?.price || 0,
      category: itemData?.category || entityType,
      creatorName: itemData?.creatorName || 'Marketplace Creator',
      createdAt: new Date().toISOString(),
      link: itemData?.link || `/${entityType}s/${entityId}`,
      raw: itemData?.raw
    };

    current.unshift(newItem);
    setLocalSavedItems(current);

    try {
      await savedApi.save(entityType, entityId);
    } catch (e) {
      console.warn('API save silent fallback', e);
    }
    return true; // Now saved
  }
};
