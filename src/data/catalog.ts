import type { SpriteRef } from '../lib/sprite';
import { KIRK_SPRITE_HASH } from '../lib/sprite';

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
}

const atlas = KIRK_SPRITE_HASH;

export const catalogEntries: CatalogEntry[] = [
  {
    key: 'item:iron-plate',
    kind: 'item',
    name: 'Iron plate',
    subtitle: 'Core metal for almost every chain',
    description:
      'The backbone material for belts, gears, structures, and most early factory expansion.',
    tags: ['smelting', 'raw material', 'starter chain'],
    icon: { sheetHash: atlas, row: 7, col: 12, label: 'Iron plate' },
    metrics: [
      { label: 'Tier', value: 'Early game' },
      { label: 'Use', value: 'Foundational' },
      { label: 'Role', value: 'Base material' },
    ],
  },
  {
    key: 'item:copper-plate',
    kind: 'item',
    name: 'Copper plate',
    subtitle: 'The conductive layer of the factory',
    description:
      'Used for circuitry, power infrastructure, and a large share of intermediate components.',
    tags: ['smelting', 'circuit chain', 'conductive'],
    icon: { sheetHash: atlas, row: 3, col: 4, label: 'Copper plate' },
    metrics: [
      { label: 'Tier', value: 'Early game' },
      { label: 'Use', value: 'Circuit substrate' },
      { label: 'Role', value: 'Base material' },
    ],
  },
  {
    key: 'item:electronic-circuit',
    kind: 'item',
    name: 'Electronic circuit',
    subtitle: 'The first true factory dependency graph',
    description:
      'A universal ingredient for control systems, science, and most mid-tier production chains.',
    tags: ['electronics', 'automation', 'essential'],
    icon: { sheetHash: atlas, row: 4, col: 7, label: 'Electronic circuit' },
    metrics: [
      { label: 'Tier', value: 'Tier 1' },
      { label: 'Use', value: 'Control and logic' },
      { label: 'Role', value: 'Intermediate product' },
    ],
  },
  {
    key: 'item:advanced-circuit',
    kind: 'item',
    name: 'Advanced circuit',
    subtitle: 'Where the factory starts to branch',
    description:
      'A higher-order component used in advanced machines, modules, and later science packs.',
    tags: ['mid game', 'modules', 'advanced'],
    icon: { sheetHash: atlas, row: 0, col: 3, label: 'Advanced circuit' },
    metrics: [
      { label: 'Tier', value: 'Tier 2' },
      { label: 'Use', value: 'Advanced electronics' },
      { label: 'Role', value: 'Intermediate product' },
    ],
  },
  {
    key: 'item:processing-unit',
    kind: 'item',
    name: 'Processing unit',
    subtitle: 'The high-end signal and control brick',
    description:
      'A critical advanced component for strong production chains, late-game logic, and research.',
    tags: ['late game', 'high tech', 'advanced'],
    icon: { sheetHash: atlas, row: 11, col: 10, label: 'Processing unit' },
    metrics: [
      { label: 'Tier', value: 'Tier 3' },
      { label: 'Use', value: 'High-end electronics' },
      { label: 'Role', value: 'Advanced intermediate' },
    ],
  },
  {
    key: 'item:battery',
    kind: 'item',
    name: 'Battery',
    subtitle: 'Energy storage and chemistry gateway',
    description:
      'Used to bridge chemical production into power systems, robotics, and later technologies.',
    tags: ['chemistry', 'power', 'storage'],
    icon: { sheetHash: atlas, row: 1, col: 1, label: 'Battery' },
    metrics: [
      { label: 'Tier', value: 'Mid game' },
      { label: 'Use', value: 'Energy storage' },
      { label: 'Role', value: 'Chemical intermediate' },
    ],
  },
  {
    key: 'item:accumulator',
    kind: 'item',
    name: 'Accumulator',
    subtitle: 'Power buffering for large grids',
    description:
      'The canonical power-storage entity, used for night coverage and peak smoothing.',
    tags: ['power', 'storage', 'grid'],
    icon: { sheetHash: atlas, row: 0, col: 0, label: 'Accumulator' },
    metrics: [
      { label: 'Tier', value: 'Power layer' },
      { label: 'Use', value: 'Grid stabilization' },
      { label: 'Role', value: 'Infrastructure' },
    ],
  },
  {
    key: 'item:solar-panel',
    kind: 'item',
    name: 'Solar panel',
    subtitle: 'Clean power for scalable grids',
    description:
      'A straightforward renewable power source for the early and mid game, and a planning anchor.',
    tags: ['power', 'renewable', 'grid'],
    icon: { sheetHash: atlas, row: 13, col: 10, label: 'Solar panel' },
    metrics: [
      { label: 'Tier', value: 'Infrastructure' },
      { label: 'Use', value: 'Renewable power' },
      { label: 'Role', value: 'Power generation' },
    ],
  },
  {
    key: 'item:speed-module',
    kind: 'item',
    name: 'Speed module',
    subtitle: 'Throughput amplifier',
    description:
      'Trade more energy consumption for faster machines and tighter production planning.',
    tags: ['modules', 'speed', 'beacons'],
    icon: { sheetHash: atlas, row: 14, col: 2, label: 'Speed module' },
    metrics: [
      { label: 'Tier', value: 'Module' },
      { label: 'Use', value: 'Speed bonus' },
      { label: 'Role', value: 'Module item' },
    ],
  },
  {
    key: 'item:productivity-module',
    kind: 'item',
    name: 'Productivity module',
    subtitle: 'Output multiplier with a cost',
    description:
      'The module that transforms balance decisions into long-term factory efficiency and savings.',
    tags: ['modules', 'productivity', 'late game'],
    icon: { sheetHash: atlas, row: 11, col: 12, label: 'Productivity module' },
    metrics: [
      { label: 'Tier', value: 'Module' },
      { label: 'Use', value: 'Productivity bonus' },
      { label: 'Role', value: 'Module item' },
    ],
  },
  {
    key: 'item:efficiency-module',
    kind: 'item',
    name: 'Efficiency module',
    subtitle: 'Pollution and power relief',
    description:
      'Useful for reducing demand in constrained grids or high-pollution production zones.',
    tags: ['modules', 'efficiency', 'control'],
    icon: { sheetHash: atlas, row: 4, col: 1, label: 'Efficiency module' },
    metrics: [
      { label: 'Tier', value: 'Module' },
      { label: 'Use', value: 'Consumption reduction' },
      { label: 'Role', value: 'Module item' },
    ],
  },
  {
    key: 'item:coal',
    kind: 'item',
    name: 'Coal',
    subtitle: 'Simple fuel and bootstrap resource',
    description:
      'A classic early-game fuel used to bootstrap burner chains and keep the first base alive.',
    tags: ['fuel', 'resource', 'bootstrap'],
    icon: { sheetHash: atlas, row: 2, col: 10, label: 'Coal' },
    metrics: [
      { label: 'Tier', value: 'Fuel' },
      { label: 'Use', value: 'Burner supply' },
      { label: 'Role', value: 'Fuel item' },
    ],
  },
  {
    key: 'item:rocket-fuel',
    kind: 'item',
    name: 'Rocket fuel',
    subtitle: 'High-density advanced fuel',
    description:
      'A late-game fuel with strong output density, useful for transportation and high-intensity systems.',
    tags: ['fuel', 'advanced', 'logistics'],
    icon: { sheetHash: atlas, row: 12, col: 13, label: 'Rocket fuel' },
    metrics: [
      { label: 'Tier', value: 'Late game' },
      { label: 'Use', value: 'High-density fuel' },
      { label: 'Role', value: 'Fuel item' },
    ],
  },
  {
    key: 'item:plastic-bar',
    kind: 'item',
    name: 'Plastic bar',
    subtitle: 'Chemical product for circuitry',
    description:
      'A plastic intermediate that bridges oil processing into circuits and higher-tech items.',
    tags: ['chemistry', 'oil', 'electronics'],
    icon: { sheetHash: atlas, row: 11, col: 5, label: 'Plastic bar' },
    metrics: [
      { label: 'Tier', value: 'Mid game' },
      { label: 'Use', value: 'Circuitry chain' },
      { label: 'Role', value: 'Chemical intermediate' },
    ],
  },
  {
    key: 'item:sulfuric-acid',
    kind: 'item',
    name: 'Sulfuric acid',
    subtitle: 'Fluid backbone for high-tech production',
    description:
      'An important fluid for batteries, processing units, uranium processing, and advanced industry.',
    tags: ['fluid', 'chemistry', 'late game'],
    icon: { sheetHash: atlas, row: 15, col: 7, label: 'Sulfuric acid' },
    metrics: [
      { label: 'Tier', value: 'Fluid' },
      { label: 'Use', value: 'Advanced chemistry' },
      { label: 'Role', value: 'Fluid intermediate' },
    ],
  },
  {
    key: 'item:iron-gear-wheel',
    kind: 'item',
    name: 'Iron gear wheel',
    subtitle: 'Mechanical shorthand for motion',
    description:
      'A mechanical intermediate used across inserters, engines, and many early automation chains.',
    tags: ['mechanical', 'intermediate', 'machines'],
    icon: { sheetHash: atlas, row: 7, col: 10, label: 'Iron gear wheel' },
    metrics: [
      { label: 'Tier', value: 'Intermediate' },
      { label: 'Use', value: 'Motion systems' },
      { label: 'Role', value: 'Mechanical part' },
    ],
  },
  {
    key: 'item:pipe',
    kind: 'item',
    name: 'Pipe',
    subtitle: 'Fluid transport primitive',
    description:
      'The simple fluid transport building block, essential for chemistry, oil, and power infrastructure.',
    tags: ['fluid', 'transport', 'infrastructure'],
    icon: { sheetHash: atlas, row: 11, col: 1, label: 'Pipe' },
    metrics: [
      { label: 'Tier', value: 'Infrastructure' },
      { label: 'Use', value: 'Fluid routing' },
      { label: 'Role', value: 'Transport part' },
    ],
  },
  {
    key: 'item:iron-ore',
    kind: 'item',
    name: 'Iron ore',
    subtitle: 'The first mining target',
    description:
      'The raw ore behind the whole smelting chain and an obvious benchmark for mining throughput.',
    tags: ['ore', 'mining', 'raw resource'],
    icon: { sheetHash: atlas, row: 7, col: 11, label: 'Iron ore' },
    metrics: [
      { label: 'Tier', value: 'Raw resource' },
      { label: 'Use', value: 'Smelting feedstock' },
      { label: 'Role', value: 'Mining target' },
    ],
  },
  {
    key: 'item:copper-ore',
    kind: 'item',
    name: 'Copper ore',
    subtitle: 'The parallel ore stream',
    description:
      'The raw input for copper plate, circuitry, and much of the factory power backbone.',
    tags: ['ore', 'mining', 'raw resource'],
    icon: { sheetHash: atlas, row: 3, col: 3, label: 'Copper ore' },
    metrics: [
      { label: 'Tier', value: 'Raw resource' },
      { label: 'Use', value: 'Smelting feedstock' },
      { label: 'Role', value: 'Mining target' },
    ],
  },
  {
    key: 'item:copper-cable',
    kind: 'item',
    name: 'Copper cable',
    subtitle: 'High-volume electronics glue',
    description:
      'A tiny item with an outsized effect on throughput because circuits eat it in bulk.',
    tags: ['electronics', 'cable', 'intermediate'],
    icon: { sheetHash: atlas, row: 3, col: 2, label: 'Copper cable' },
    metrics: [
      { label: 'Tier', value: 'Intermediate' },
      { label: 'Use', value: 'Circuit ingredient' },
      { label: 'Role', value: 'Electronics input' },
    ],
  },
  {
    key: 'item:steel-plate',
    kind: 'item',
    name: 'Steel plate',
    subtitle: 'Compressed structural strength',
    description:
      'The higher-tier metal plate that unlocks engines, stronger structures, and later scaling.',
    tags: ['smelting', 'structure', 'mid game'],
    icon: { sheetHash: atlas, row: 14, col: 13, label: 'Steel plate' },
    metrics: [
      { label: 'Tier', value: 'Mid game' },
      { label: 'Use', value: 'Heavy structures' },
      { label: 'Role', value: 'Structural metal' },
    ],
  },
  {
    key: 'item:engine-unit',
    kind: 'item',
    name: 'Engine unit',
    subtitle: 'Motion platform for vehicles and infrastructure',
    description:
      'A mechanical intermediate that sits at the center of transport, pumps, and vehicle production.',
    tags: ['mechanical', 'vehicles', 'intermediate'],
    icon: { sheetHash: atlas, row: 5, col: 4, label: 'Engine unit' },
    metrics: [
      { label: 'Tier', value: 'Advanced intermediate' },
      { label: 'Use', value: 'Vehicle systems' },
      { label: 'Role', value: 'Mechanical assembly' },
    ],
  },
  {
    key: 'item:transport-belt',
    kind: 'item',
    name: 'Transport belt',
    subtitle: 'The first throughput abstraction',
    description:
      'A core logistics component and a natural benchmark for early movement and saturation.',
    tags: ['logistics', 'belt', 'transport'],
    icon: { sheetHash: atlas, row: 15, col: 12, label: 'Transport belt' },
    metrics: [
      { label: 'Tier', value: 'Logistics' },
      { label: 'Use', value: 'Item transport' },
      { label: 'Role', value: 'Logistics primitive' },
    ],
  },
  {
    key: 'item:inserter',
    kind: 'item',
    name: 'Inserter',
    subtitle: 'The hand that moves items',
    description:
      'The canonical insertion device that ties production, logistics, and machine input together.',
    tags: ['logistics', 'inserter', 'transport'],
    icon: { sheetHash: atlas, row: 7, col: 8, label: 'Inserter' },
    metrics: [
      { label: 'Tier', value: 'Logistics' },
      { label: 'Use', value: 'Item transfer' },
      { label: 'Role', value: 'Logistics primitive' },
    ],
  },
  {
    key: 'item:automation-science-pack',
    kind: 'item',
    name: 'Automation science pack',
    subtitle: 'The first research milestone',
    description:
      'The starter science pack and an easy indicator for the health of your earliest production loop.',
    tags: ['science', 'research', 'starter'],
    icon: { sheetHash: atlas, row: 0, col: 14, label: 'Automation science pack' },
    metrics: [
      { label: 'Tier', value: 'Science' },
      { label: 'Use', value: 'Research' },
      { label: 'Role', value: 'Science pack' },
    ],
  },
  {
    key: 'item:logistic-science-pack',
    kind: 'item',
    name: 'Logistic science pack',
    subtitle: 'The first logistics-driven research pack',
    description:
      'A research product that serves as a useful signal for inserter and belt throughput planning.',
    tags: ['science', 'research', 'logistics'],
    icon: { sheetHash: atlas, row: 8, col: 13, label: 'Logistic science pack' },
    metrics: [
      { label: 'Tier', value: 'Science' },
      { label: 'Use', value: 'Research' },
      { label: 'Role', value: 'Science pack' },
    ],
  },
  {
    key: 'recipe:iron-plate',
    kind: 'recipe',
    name: 'Iron plate',
    subtitle: 'Smelting route from ore to stock material',
    description:
      'The standard smelting loop that turns ore into plates for nearly every other chain.',
    tags: ['recipe', 'smelting', 'core'],
    icon: { sheetHash: atlas, row: 7, col: 12, label: 'Iron plate recipe' },
    metrics: [
      { label: 'Category', value: 'Smelting' },
      { label: 'Time', value: '3.2 s' },
      { label: 'Productivity', value: 'Allowed' },
    ],
    ingredients: [{ key: 'item:iron-ore', amount: 1, name: 'Iron ore' }],
    results: [{ key: 'item:iron-plate', amount: 1, name: 'Iron plate' }],
    recipe: { category: 'smelting', energyRequired: 3.2, productivity: true },
  },
  {
    key: 'recipe:copper-cable',
    kind: 'recipe',
    name: 'Copper cable',
    subtitle: 'Two cables, one plate, one fast dependency',
    description:
      'A tiny recipe with huge consequences. It feeds circuits, science, and almost every electronics chain.',
    tags: ['recipe', 'electronics', 'fast'],
    icon: { sheetHash: atlas, row: 3, col: 2, label: 'Copper cable recipe' },
    metrics: [
      { label: 'Category', value: 'Crafting' },
      { label: 'Time', value: '0.5 s' },
      { label: 'Productivity', value: 'Allowed' },
    ],
    ingredients: [{ key: 'item:copper-plate', amount: 1, name: 'Copper plate' }],
    results: [{ key: 'item:copper-cable', amount: 2, name: 'Copper cable' }],
    recipe: { category: 'crafting', energyRequired: 0.5, productivity: true },
  },
  {
    key: 'recipe:electronic-circuit',
    kind: 'recipe',
    name: 'Electronic circuit',
    subtitle: 'The classic early branching recipe',
    description:
      'The first non-trivial circuit in the graph, turning plates and cable into logic.',
    tags: ['recipe', 'electronics', 'branching'],
    icon: { sheetHash: atlas, row: 4, col: 7, label: 'Electronic circuit recipe' },
    metrics: [
      { label: 'Category', value: 'Crafting' },
      { label: 'Time', value: '0.5 s' },
      { label: 'Productivity', value: 'Allowed' },
    ],
    ingredients: [
      { key: 'item:iron-plate', amount: 1, name: 'Iron plate' },
      { key: 'item:copper-cable', amount: 3, name: 'Copper cable' },
    ],
    results: [{ key: 'item:electronic-circuit', amount: 1, name: 'Electronic circuit' }],
    recipe: { category: 'crafting', energyRequired: 0.5, productivity: true },
  },
  {
    key: 'recipe:advanced-circuit',
    kind: 'recipe',
    name: 'Advanced circuit',
    subtitle: 'Mid-tier circuitry with oil involvement',
    description:
      'A classic junction where mining, oil, and cable logistics all have to agree.',
    tags: ['recipe', 'oil chain', 'mid game'],
    icon: { sheetHash: atlas, row: 0, col: 3, label: 'Advanced circuit recipe' },
    metrics: [
      { label: 'Category', value: 'Crafting' },
      { label: 'Time', value: '6 s' },
      { label: 'Productivity', value: 'Allowed' },
    ],
    ingredients: [
      { key: 'item:electronic-circuit', amount: 2, name: 'Electronic circuit' },
      { key: 'item:plastic-bar', amount: 2, name: 'Plastic bar' },
      { key: 'item:copper-cable', amount: 4, name: 'Copper cable' },
    ],
    results: [{ key: 'item:advanced-circuit', amount: 1, name: 'Advanced circuit' }],
    recipe: { category: 'crafting', energyRequired: 6, productivity: true },
  },
  {
    key: 'recipe:processing-unit',
    kind: 'recipe',
    name: 'Processing unit',
    subtitle: 'High-tech control and signal processing',
    description:
      'A late-game recipe that needs advanced electronics plus acid, making it a planning hotspot.',
    tags: ['recipe', 'high tech', 'late game'],
    icon: { sheetHash: atlas, row: 11, col: 10, label: 'Processing unit recipe' },
    metrics: [
      { label: 'Category', value: 'Crafting with fluid' },
      { label: 'Time', value: '10 s' },
      { label: 'Productivity', value: 'Allowed' },
    ],
    ingredients: [
      { key: 'item:electronic-circuit', amount: 20, name: 'Electronic circuit' },
      { key: 'item:advanced-circuit', amount: 2, name: 'Advanced circuit' },
      { key: 'item:sulfuric-acid', amount: 5, name: 'Sulfuric acid' },
    ],
    results: [{ key: 'item:processing-unit', amount: 1, name: 'Processing unit' }],
    recipe: { category: 'crafting-with-fluid', energyRequired: 10, productivity: true },
  },
  {
    key: 'recipe:engine-unit',
    kind: 'recipe',
    name: 'Engine unit',
    subtitle: 'Mechanical milestone for vehicles and beyond',
    description:
      'A key advanced-intermediate used in vehicles, pumping, and transport-related production.',
    tags: ['recipe', 'mechanical', 'advanced'],
    icon: { sheetHash: atlas, row: 5, col: 4, label: 'Engine unit recipe' },
    metrics: [
      { label: 'Category', value: 'Advanced crafting' },
      { label: 'Time', value: '10 s' },
      { label: 'Productivity', value: 'Allowed' },
    ],
    ingredients: [
      { key: 'item:steel-plate', amount: 1, name: 'Steel plate' },
      { key: 'item:iron-gear-wheel', amount: 1, name: 'Iron gear wheel' },
      { key: 'item:pipe', amount: 2, name: 'Pipe' },
    ],
    results: [{ key: 'item:engine-unit', amount: 1, name: 'Engine unit' }],
    recipe: { category: 'advanced-crafting', energyRequired: 10, productivity: true },
  },
  {
    key: 'recipe:battery',
    kind: 'recipe',
    name: 'Battery',
    subtitle: 'Chemistry bridge into power storage',
    description:
      'A fluid-heavy recipe that is a natural checkpoint for any expansion into high-tech systems.',
    tags: ['recipe', 'chemistry', 'power'],
    icon: { sheetHash: atlas, row: 1, col: 1, label: 'Battery recipe' },
    metrics: [
      { label: 'Category', value: 'Chemistry' },
      { label: 'Time', value: '4 s' },
      { label: 'Productivity', value: 'Allowed' },
    ],
    ingredients: [
      { key: 'item:sulfuric-acid', amount: 20, name: 'Sulfuric acid' },
      { key: 'item:iron-plate', amount: 1, name: 'Iron plate' },
      { key: 'item:copper-plate', amount: 1, name: 'Copper plate' },
    ],
    results: [{ key: 'item:battery', amount: 1, name: 'Battery' }],
    recipe: { category: 'chemistry', energyRequired: 4, productivity: true },
  },
  {
    key: 'recipe:accumulator',
    kind: 'recipe',
    name: 'Accumulator',
    subtitle: 'Power storage assembly',
    description:
      'A simple but strategic recipe that turns batteries into grid resilience.',
    tags: ['recipe', 'power', 'storage'],
    icon: { sheetHash: atlas, row: 0, col: 0, label: 'Accumulator recipe' },
    metrics: [
      { label: 'Category', value: 'Crafting' },
      { label: 'Time', value: '10 s' },
      { label: 'Productivity', value: 'Not allowed' },
    ],
    ingredients: [
      { key: 'item:iron-plate', amount: 2, name: 'Iron plate' },
      { key: 'item:battery', amount: 5, name: 'Battery' },
    ],
    results: [{ key: 'item:accumulator', amount: 1, name: 'Accumulator' }],
    recipe: { category: 'crafting', energyRequired: 10, productivity: false },
  },
  {
    key: 'recipe:logistic-science-pack',
    kind: 'recipe',
    name: 'Logistic science pack',
    subtitle: 'The first real research logistics gate',
    description:
      'A representative science recipe that ties transport, insertion, and throughput together.',
    tags: ['recipe', 'science', 'research'],
    icon: { sheetHash: atlas, row: 8, col: 13, label: 'Logistic science pack recipe' },
    metrics: [
      { label: 'Category', value: 'Crafting' },
      { label: 'Time', value: '6 s' },
      { label: 'Productivity', value: 'Allowed' },
    ],
    ingredients: [
      { key: 'item:inserter', amount: 1, name: 'Inserter' },
      { key: 'item:transport-belt', amount: 1, name: 'Transport belt' },
    ],
    results: [{ key: 'item:logistic-science-pack', amount: 1, name: 'Logistic science pack' }],
    recipe: { category: 'crafting', energyRequired: 6, productivity: true },
  },
  {
    key: 'recipe:automation-science-pack',
    kind: 'recipe',
    name: 'Automation science pack',
    subtitle: 'Bootstrap research throughput',
    description:
      'The first science pack and a clean benchmark for early production planning.',
    tags: ['recipe', 'science', 'starter'],
    icon: { sheetHash: atlas, row: 0, col: 14, label: 'Automation science pack recipe' },
    metrics: [
      { label: 'Category', value: 'Crafting' },
      { label: 'Time', value: '5 s' },
      { label: 'Productivity', value: 'Allowed' },
    ],
    ingredients: [
      { key: 'item:copper-plate', amount: 1, name: 'Copper plate' },
      { key: 'item:iron-gear-wheel', amount: 1, name: 'Iron gear wheel' },
    ],
    results: [{ key: 'item:automation-science-pack', amount: 1, name: 'Automation science pack' }],
    recipe: { category: 'crafting', energyRequired: 5, productivity: true },
  },
  {
    key: 'machine:assembling-machine-2',
    kind: 'machine',
    name: 'Assembling machine 2',
    subtitle: 'The flexible all-rounder',
    description:
      'A versatile crafting machine with room for modules and a much better speed profile than the starter machine.',
    tags: ['machine', 'crafting', 'modules'],
    icon: { sheetHash: atlas, row: 0, col: 11, label: 'Assembling machine 2' },
    metrics: [
      { label: 'Speed', value: '0.75' },
      { label: 'Modules', value: '2' },
      { label: 'Energy', value: '150 kW' },
    ],
    machine: {
      categories: ['basic-crafting', 'crafting', 'advanced-crafting', 'crafting-with-fluid'],
      craftingSpeed: 0.75,
      moduleSlots: 2,
      energyUsage: '150 kW',
      emissions: '3 pollution/min',
    },
  },
  {
    key: 'machine:chemical-plant',
    kind: 'machine',
    name: 'Chemical plant',
    subtitle: 'Fluid-driven manufacturing hub',
    description:
      'The machine that unlocks the chemistry half of the factory and makes the oil network worth planning.',
    tags: ['machine', 'chemistry', 'fluid'],
    icon: { sheetHash: atlas, row: 2, col: 5, label: 'Chemical plant' },
    metrics: [
      { label: 'Speed', value: '1.0' },
      { label: 'Modules', value: '3' },
      { label: 'Energy', value: '210 kW' },
    ],
    machine: {
      categories: ['chemistry'],
      craftingSpeed: 1,
      moduleSlots: 3,
      energyUsage: '210 kW',
      emissions: '4 pollution/min',
    },
  },
  {
    key: 'machine:electric-furnace',
    kind: 'machine',
    name: 'Electric furnace',
    subtitle: 'High-throughput smelting',
    description:
      'A strong smelting machine that makes late-game metal production far easier to scale.',
    tags: ['machine', 'smelting', 'modules'],
    icon: { sheetHash: atlas, row: 4, col: 5, label: 'Electric furnace' },
    metrics: [
      { label: 'Speed', value: '2.0' },
      { label: 'Modules', value: '2' },
      { label: 'Energy', value: '180 kW' },
    ],
    machine: {
      categories: ['smelting'],
      craftingSpeed: 2,
      moduleSlots: 2,
      energyUsage: '180 kW',
      emissions: '1 pollution/min',
    },
  },
  {
    key: 'machine:lab',
    kind: 'machine',
    name: 'Lab',
    subtitle: 'Research execution layer',
    description:
      'The analysis target for science throughput and a natural landing point for planning dashboards.',
    tags: ['machine', 'research', 'science'],
    icon: { sheetHash: atlas, row: 8, col: 0, label: 'Lab' },
    metrics: [
      { label: 'Speed', value: '1.0' },
      { label: 'Modules', value: '0' },
      { label: 'Energy', value: '60 kW' },
    ],
    machine: {
      categories: ['science'],
      craftingSpeed: 1,
      moduleSlots: 0,
      energyUsage: '60 kW',
      emissions: '0 pollution/min',
    },
  },
  {
    key: 'module:speed-module',
    kind: 'module',
    name: 'Speed module',
    subtitle: 'The classic throughput boost',
    description:
      'An early module benchmark for the dashboard, useful for both speed and beacon planning.',
    tags: ['module', 'speed', 'beacon'],
    icon: { sheetHash: atlas, row: 14, col: 2, label: 'Speed module' },
    metrics: [
      { label: 'Category', value: 'Speed' },
      { label: 'Effect', value: '+20% speed' },
      { label: 'Tradeoff', value: '+50% consumption' },
    ],
    module: {
      category: 'speed',
      effects: ['+20% speed', '+50% consumption'],
    },
  },
  {
    key: 'module:productivity-module',
    kind: 'module',
    name: 'Productivity module',
    subtitle: 'Output first, balance later',
    description:
      'The advanced module that makes planning more interesting by trading speed for material gain.',
    tags: ['module', 'productivity', 'late game'],
    icon: { sheetHash: atlas, row: 11, col: 12, label: 'Productivity module' },
    metrics: [
      { label: 'Category', value: 'Productivity' },
      { label: 'Effect', value: '+4% productivity' },
      { label: 'Tradeoff', value: '-5% speed' },
    ],
    module: {
      category: 'productivity',
      effects: ['+4% productivity', '-5% speed', '+40% consumption'],
    },
  },
  {
    key: 'module:efficiency-module',
    kind: 'module',
    name: 'Efficiency module',
    subtitle: 'Power and pollution relief',
    description:
      'A strong utility module for situations where the grid or pollution budget is the bottleneck.',
    tags: ['module', 'efficiency', 'control'],
    icon: { sheetHash: atlas, row: 4, col: 1, label: 'Efficiency module' },
    metrics: [
      { label: 'Category', value: 'Efficiency' },
      { label: 'Effect', value: '-30% consumption' },
      { label: 'Tradeoff', value: 'No speed bonus' },
    ],
    module: {
      category: 'efficiency',
      effects: ['-30% consumption'],
    },
  },
  {
    key: 'fuel:coal',
    kind: 'fuel',
    name: 'Coal',
    subtitle: 'Starter fuel for burner systems',
    description:
      'The classic bootstrap fuel and a useful baseline for burner, furnace, and power comparisons.',
    tags: ['fuel', 'burner', 'bootstrap'],
    icon: { sheetHash: atlas, row: 2, col: 10, label: 'Coal' },
    metrics: [
      { label: 'Category', value: 'Chemical' },
      { label: 'Energy', value: '4 MJ' },
      { label: 'Use', value: 'Burner fuel' },
    ],
    fuel: {
      category: 'chemical',
      value: '4 MJ',
    },
  },
  {
    key: 'fuel:rocket-fuel',
    kind: 'fuel',
    name: 'Rocket fuel',
    subtitle: 'Dense advanced fuel',
    description:
      'A premium fuel benchmark for high-end logistics and high-performance planning scenarios.',
    tags: ['fuel', 'advanced', 'dense'],
    icon: { sheetHash: atlas, row: 12, col: 13, label: 'Rocket fuel' },
    metrics: [
      { label: 'Category', value: 'Chemical' },
      { label: 'Energy', value: '100 MJ' },
      { label: 'Use', value: 'High-density fuel' },
    ],
    fuel: {
      category: 'chemical',
      value: '100 MJ',
    },
  },
  {
    key: 'planet:nauvis',
    kind: 'planet',
    name: 'Nauvis',
    subtitle: 'Primary planning surface',
    description:
      'The standard home planet in the Factorio dataset, perfect for the first dashboard base line.',
    tags: ['planet', 'surface', 'planning'],
    icon: { sheetHash: atlas, row: 9, col: 5, label: 'Nauvis' },
    metrics: [
      { label: 'Resources', value: '6 core resources' },
      { label: 'Cycle', value: '25200 ticks' },
      { label: 'Role', value: 'Main surface' },
    ],
    planet: {
      resources: ['coal', 'copper-ore', 'crude-oil', 'iron-ore', 'stone', 'uranium-ore'],
      cycle: '25200 ticks',
    },
  },
];

export const workspaceTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'factory', label: 'Factory' },
  { key: 'library', label: 'Library' },
  { key: 'blueprints', label: 'Blueprints' },
  { key: 'planets', label: 'Planets' },
  { key: 'settings', label: 'Settings' },
] as const;

export const quickActions = [
  {
    title: 'Open the production spine',
    description: 'Jump to the advanced circuit chain and inspect the branching pressure points.',
    targetKey: 'recipe:advanced-circuit',
    accent: 'amber',
  },
  {
    title: 'Inspect power storage',
    description: 'Focus the dashboard on accumulator flow and grid stability.',
    targetKey: 'item:accumulator',
    accent: 'cyan',
  },
  {
    title: 'Plan the science path',
    description: 'Switch to the lab and science pack chain as the next planning milestone.',
    targetKey: 'recipe:logistic-science-pack',
    accent: 'violet',
  },
] as const;

export const dashboardSignals = [
  { label: 'Imported entries', value: String(catalogEntries.length) },
  { label: 'Recipe nodes', value: String(catalogEntries.filter((entry) => entry.kind === 'recipe').length) },
  { label: 'Machines', value: String(catalogEntries.filter((entry) => entry.kind === 'machine').length) },
  { label: 'Atlas hash', value: KIRK_SPRITE_HASH.slice(0, 8) },
] as const;
