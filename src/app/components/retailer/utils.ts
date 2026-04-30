import type { MarketplaceItem } from '../../../hooks/useMarketplace';

export const getProductRoute = (id: string) => {
  const charCode = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return ['المسار A', 'المسار B', 'المسار C'][charCode % 3];
};

export const getProductImage = (category: string) => {
  const emojis: Record<string, string> = {
    grains: '🌾', oils: '🫒', dairy: '🥛', beverages: '🥤', food: '🍽️', canned: '🥫'
  };
  return emojis[category] || '📦';
};

export const isCollaborative = (p: MarketplaceItem) => {
  const route = getProductRoute(p.id);
  return route === 'المسار A' || route === 'المسار B';
};

export const isFinanced = (p: MarketplaceItem) => p.price <= 18000;
export const isInstantSettlement = (p: MarketplaceItem) => p.price > 10000;
export const routeDiscount = (p: MarketplaceItem) => (isCollaborative(p) ? 30 : 0);

export const toggleInArray = (array: string[], value: string) => {
  return array.includes(value) ? array.filter(item => item !== value) : [...array, value];
};
