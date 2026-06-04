import { catalogEntries } from '../data/kirkCatalog';
import type { CatalogEntry } from '../data/catalogTypes';

export type PortKind = 'input' | 'output';
export type PortSide = 'top' | 'right' | 'bottom' | 'left';

export interface GridSize {
  width: number;
  height: number;
}

export interface PortCell {
  x: number;
  y: number;
  side: PortSide;
  index: number;
}

export interface PortSlot {
  id: string;
  kind: PortKind;
  label: string;
  cell: PortCell | null;
  bindingKey?: string | null;
  bindingLabel?: string | null;
}

export interface ResearchProfile {
  key: string;
  label: string;
  description: string;
  allowedMachineKeys: string[];
}

export interface RecipeTreeNode {
  key: string;
  label: string;
  kind: 'recipe' | 'ingredient';
  amount: number;
  rate: string;
  note?: string;
  children?: RecipeTreeNode[];
}

export interface BlueprintConfig {
  grid: GridSize;
  recipeKey: string;
  researchProfile: string;
  allowedMachineKeys: string[];
  ports: PortSlot[];
}

export interface PortBindingOption {
  key: string;
  label: string;
  amount: number;
  note?: string;
}

export const gridPresets: Array<{ label: string; size: GridSize }> = [
  { label: '12 x 12', size: { width: 12, height: 12 } },
  { label: '15 x 15', size: { width: 15, height: 15 } },
  { label: '20 x 20', size: { width: 20, height: 20 } },
];

export const researchProfiles: ResearchProfile[] = [
  {
    key: 'starter',
    label: 'Starter',
    description: 'Minimal early-game machines and basic crafting only.',
    allowedMachineKeys: ['machine:assembling-machine-1', 'machine:stone-furnace', 'machine:steel-furnace', 'machine:lab'],
  },
  {
    key: 'automation',
    label: 'Automation',
    description: 'Adds the mid-tier crafting and smelting stack.',
    allowedMachineKeys: [
      'machine:assembling-machine-1',
      'machine:assembling-machine-2',
      'machine:stone-furnace',
      'machine:steel-furnace',
      'machine:electric-furnace',
      'machine:lab',
      'machine:chemical-plant',
    ],
  },
  {
    key: 'advanced',
    label: 'Advanced',
    description: 'Unlocks later production and high-tech infrastructure.',
    allowedMachineKeys: [
      'machine:assembling-machine-1',
      'machine:assembling-machine-2',
      'machine:assembling-machine-3',
      'machine:steel-furnace',
      'machine:electric-furnace',
      'machine:chemical-plant',
      'machine:lab',
      'machine:rocket-silo',
      'machine:beacon',
      'machine:roboport',
    ],
  },
  {
    key: 'full',
    label: 'Full',
    description: 'All imported machines are available.',
    allowedMachineKeys: [],
  },
];

export const recipeEntries = catalogEntries
  .filter((entry): entry is CatalogEntry & { kind: 'recipe' } => entry.kind === 'recipe')
  .sort((a, b) => a.name.localeCompare(b.name));

export const machineEntries = catalogEntries
  .filter((entry): entry is CatalogEntry & { kind: 'machine' } => entry.kind === 'machine')
  .sort((a, b) => a.name.localeCompare(b.name));

export const itemEntries = catalogEntries
  .filter((entry): entry is CatalogEntry & { kind: 'item' } => entry.kind === 'item')
  .sort((a, b) => a.name.localeCompare(b.name));

export function getDefaultRecipeKey(): string {
  return recipeEntries.find((entry) => entry.key === 'recipe:assembling-machine-1')?.key ?? recipeEntries[0]?.key ?? '';
}

export function getProfileByKey(key: string): ResearchProfile {
  return researchProfiles.find((profile) => profile.key === key) ?? researchProfiles[0];
}

export function getAllowedMachineKeys(profileKey: string): string[] {
  const profile = getProfileByKey(profileKey);
  if (profile.key === 'full') {
    return machineEntries.map((entry) => entry.key);
  }
  return profile.allowedMachineKeys.filter((key) => machineEntries.some((machine) => machine.key === key));
}

export function createDefaultPorts(): PortSlot[] {
  return [
    { id: 'input-1', kind: 'input', label: 'Input 1', cell: null, bindingKey: null, bindingLabel: null },
    { id: 'input-2', kind: 'input', label: 'Input 2', cell: null, bindingKey: null, bindingLabel: null },
    { id: 'output-1', kind: 'output', label: 'Output 1', cell: null, bindingKey: null, bindingLabel: null },
  ];
}

export function createPortCell(grid: GridSize, side: PortSide, index: number): PortCell {
  if (side === 'top') return { x: index + 1, y: 0, side, index };
  if (side === 'bottom') return { x: index + 1, y: grid.height + 1, side, index };
  if (side === 'left') return { x: 0, y: index + 1, side, index };
  return { x: grid.width + 1, y: index + 1, side, index };
}

export function getBorderCells(grid: GridSize): PortCell[] {
  const cells: PortCell[] = [];
  for (let x = 0; x < grid.width; x += 1) cells.push(createPortCell(grid, 'top', x));
  for (let y = 0; y < grid.height; y += 1) cells.push(createPortCell(grid, 'right', y));
  for (let x = grid.width - 1; x >= 0; x -= 1) cells.push(createPortCell(grid, 'bottom', x));
  for (let y = grid.height - 1; y >= 0; y -= 1) cells.push(createPortCell(grid, 'left', y));
  return cells;
}

export function cellId(cell: PortCell): string {
  return `${cell.side}:${cell.index}`;
}

export function formatBaseRate(entry: CatalogEntry): string {
  const recipe = entry.recipe;
  if (!recipe) return 'n/a';
  const craftsPerSecond = 1 / recipe.energyRequired;
  const outputs = entry.results?.[0]?.amount ?? 1;
  return `${(craftsPerSecond * 60).toFixed(1)} crafts/min | ${(outputs * craftsPerSecond).toFixed(2)} output/s`;
}

export function buildRecipeTree(recipeKey: string, depth = 0, seen = new Set<string>()): RecipeTreeNode | null {
  const recipe = recipeEntries.find((entry) => entry.key === recipeKey);
  if (!recipe || seen.has(recipe.key)) return null;

  const nextSeen = new Set(seen);
  nextSeen.add(recipe.key);

  const children = (recipe.ingredients ?? []).map((ingredient) => {
    const producer = recipeEntries.find((candidate) =>
      candidate.results?.some((result) => result.key === ingredient.key),
    );
    const baseRate = `${ingredient.amount} / craft`;

    if (producer && depth < 2) {
      const branch = buildRecipeTree(producer.key, depth + 1, nextSeen);
      return {
        key: ingredient.key,
        label: ingredient.name,
        kind: 'ingredient' as const,
        amount: ingredient.amount,
        rate: baseRate,
        note: `Produced by ${producer.name}`,
        children: branch ? [branch] : undefined,
      };
    }

    const source = itemEntries.find((item) => item.key === ingredient.key);
    return {
      key: ingredient.key,
      label: ingredient.name,
      kind: 'ingredient' as const,
      amount: ingredient.amount,
      rate: baseRate,
      note: source?.subtitle ?? 'Raw or imported input',
    };
  });

  return {
    key: recipe.key,
    label: recipe.name,
    kind: 'recipe',
    amount: recipe.results?.[0]?.amount ?? 1,
    rate: formatBaseRate(recipe),
    note: recipe.recipe ? `${recipe.recipe.category} | ${recipe.recipe.energyRequired}s` : undefined,
    children,
  };
}

export function getRecipeInputOptions(recipeKey: string): PortBindingOption[] {
  const tree = buildRecipeTree(recipeKey);
  if (!tree) return [];

  const totals = new Map<string, PortBindingOption>();

  const walk = (node: RecipeTreeNode) => {
    if (node.kind === 'ingredient' && (!node.children || node.children.length === 0)) {
      const existing = totals.get(node.key);
      if (existing) {
        existing.amount += node.amount;
        return;
      }
      totals.set(node.key, {
        key: node.key,
        label: node.label,
        amount: node.amount,
        note: node.note,
      });
      return;
    }

    for (const child of node.children ?? []) {
      walk(child);
    }
  };

  walk(tree);
  return [...totals.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function getRecipeOutputOptions(recipeKey: string): PortBindingOption[] {
  const recipe = recipeEntries.find((entry) => entry.key === recipeKey);
  if (!recipe) return [];
  return (recipe.results ?? []).map((result) => ({
    key: result.key,
    label: result.name,
    amount: result.amount ?? 1,
    note: 'Recipe output',
  }));
}

export function buildBlueprintConfig(
  grid: GridSize,
  recipeKey: string,
  researchProfile: string,
  allowedMachineKeys: string[],
  ports: PortSlot[],
): BlueprintConfig {
  return {
    grid,
    recipeKey,
    researchProfile,
    allowedMachineKeys,
    ports,
  };
}
