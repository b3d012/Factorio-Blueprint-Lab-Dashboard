import type { SpriteRef } from '../lib/sprite';

export type CatalogKind = 'item' | 'recipe' | 'machine' | 'module' | 'fuel' | 'planet';

export interface IngredientRef {
  key: string;
  amount: number;
  name: string;
}

export interface CatalogEntry {
  key: string;
  kind: CatalogKind;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: SpriteRef;
  metrics: Array<{ label: string; value: string }>;
  ingredients?: IngredientRef[];
  results?: IngredientRef[];
  recipe?: {
    category: string;
    energyRequired: number;
    productivity: boolean;
  };
  machine?: {
    categories: string[];
    craftingSpeed: number;
    moduleSlots: number;
    energyUsage: string;
    emissions: string;
  };
  module?: {
    category: string;
    effects: string[];
  };
  planet?: {
    resources: string[];
    cycle: string;
  };
  fuel?: {
    category: string;
    value: string;
  };
  featured?: boolean;
}
