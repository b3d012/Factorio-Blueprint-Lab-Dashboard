import kirkData from './kirk/vanilla-2.0.55.json';
import type { CatalogEntry, IngredientRef } from './catalogTypes';
import type { SpriteRef } from '../lib/sprite';
import { KIRK_SPRITE_CELL } from '../lib/sprite';

type LocalizedText = { en?: string; [key: string]: string | undefined };

interface RawStack {
  name: string;
  amount?: number;
  probability?: number;
}

interface RawItem {
  key: string;
  group: string;
  subgroup: string;
  icon_col: number;
  icon_row: number;
  order: string;
  localized_name: LocalizedText;
  type?: string;
}

interface RawRecipe {
  key: string;
  category: string;
  energy_required: number;
  icon_col: number;
  icon_row: number;
  ingredients: RawStack[];
  results: RawStack[];
  allow_productivity: boolean;
  localized_name: LocalizedText;
  subgroup: string;
  order: string;
}

interface RawMachine {
  key: string;
  icon_col: number;
  icon_row: number;
  localized_name: LocalizedText;
  crafting_speed?: number;
  module_slots?: number;
  crafting_categories?: string[];
  energy_usage?: number;
  energy_source?: {
    type?: string;
    fuel_category?: string;
    emissions_per_minute?: Record<string, number>;
  };
}

interface RawModule {
  item_key: string;
  category: string;
  effect: Record<string, number>;
}

interface RawFuel {
  item_key: string;
  category: string;
  value: number;
}

interface RawPlanet {
  key: string;
  icon_col: number;
  icon_row: number;
  localized_name: LocalizedText;
  resources?: {
    offshore?: string[];
    plants?: string[];
    resource?: string[];
  };
  surface_properties?: {
    'day-night-cycle'?: number;
  };
}

interface KirkDataset {
  items: RawItem[];
  recipes: RawRecipe[];
  crafting_machines: RawMachine[];
  mining_drills?: RawMachine[];
  boilers?: RawMachine[];
  offshore_pumps?: RawMachine[];
  rocket_silo?: RawMachine[];
  agricultural_tower?: RawMachine[];
  modules: RawModule[];
  fuel: RawFuel[];
  planets: RawPlanet[];
  sprites: {
    hash: string;
    width: number;
    height: number;
    extra?: Record<string, { icon_col: number; icon_row: number; name: string }>;
  };
}

const dataset = kirkData as KirkDataset;

const itemByKey = new Map(dataset.items.map((item) => [item.key, item]));
const recipeByResult = new Map<string, RawRecipe>();
const recipeByKey = new Map(dataset.recipes.map((recipe) => [recipe.key, recipe]));

for (const recipe of dataset.recipes) {
  for (const result of recipe.results) {
    recipeByResult.set(result.name, recipe);
  }
}

const featuredKeys = new Set([
  'item:iron-plate',
  'item:copper-plate',
  'item:electronic-circuit',
  'item:advanced-circuit',
  'item:processing-unit',
  'item:battery',
  'item:accumulator',
  'item:solar-panel',
  'item:speed-module',
  'item:productivity-module',
  'item:efficiency-module',
  'item:coal',
  'item:rocket-fuel',
  'item:plastic-bar',
  'item:sulfuric-acid',
  'item:iron-gear-wheel',
  'item:pipe',
  'item:iron-ore',
  'item:copper-ore',
  'item:copper-cable',
  'item:steel-plate',
  'item:engine-unit',
  'item:transport-belt',
  'item:inserter',
  'item:automation-science-pack',
  'item:logistic-science-pack',
  'recipe:iron-plate',
  'recipe:copper-cable',
  'recipe:electronic-circuit',
  'recipe:advanced-circuit',
  'recipe:processing-unit',
  'recipe:engine-unit',
  'recipe:battery',
  'recipe:accumulator',
  'recipe:logistic-science-pack',
  'recipe:automation-science-pack',
  'machine:assembling-machine-2',
  'machine:chemical-plant',
  'machine:electric-furnace',
  'machine:lab',
  'module:speed-module',
  'module:productivity-module',
  'module:efficiency-module',
  'fuel:coal',
  'fuel:rocket-fuel',
  'planet:nauvis',
]);

function nameOf(value: LocalizedText | undefined, fallback: string): string {
  return value?.en?.trim() || fallback;
}

function sprite(row: number, col: number, label: string): SpriteRef {
  return { sheetHash: dataset.sprites.hash, row, col, label };
}

function stackKey(name: string): string {
  return `item:${name}`;
}

function formatAmount(amount?: number): string {
  if (amount === undefined) return '1';
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

function resultList(results: RawStack[]): IngredientRef[] {
  return results.map((result) => ({
    key: stackKey(result.name),
    amount: result.amount ?? 1,
    name: result.name.replace(/-/g, ' '),
  }));
}

function ingredientList(ingredients: RawStack[]): IngredientRef[] {
  return ingredients.map((ingredient) => ({
    key: stackKey(ingredient.name),
    amount: ingredient.amount ?? 1,
    name: ingredient.name.replace(/-/g, ' '),
  }));
}

function findRecipeForItem(itemKey: string): RawRecipe | undefined {
  return recipeByResult.get(itemKey.replace('item:', ''));
}

function buildItemEntry(item: RawItem): CatalogEntry {
  const producer = findRecipeForItem(`item:${item.key}`);
  const subtitle = producer
    ? `Produced by ${nameOf(producer.localized_name, producer.key)}`
    : `${item.group} / ${item.subgroup}`;

  const description = producer
    ? `This imported item is wired into the Kirk data snapshot and produced by the ${nameOf(
        producer.localized_name,
        producer.key,
      )} recipe.`
    : `This imported Factorio item comes from the Kirk data snapshot and lives in the ${item.group} / ${item.subgroup} grouping.`;

  const metrics = [
    { label: 'Group', value: item.group },
    { label: 'Subgroup', value: item.subgroup },
    { label: 'Order', value: item.order },
  ];

  return {
    key: `item:${item.key}`,
    kind: 'item',
    name: nameOf(item.localized_name, item.key.replace(/-/g, ' ')),
    subtitle,
    description,
    tags: ['item', item.group, item.subgroup],
    icon: sprite(item.icon_row, item.icon_col, item.key),
    metrics,
    featured: featuredKeys.has(`item:${item.key}`),
    recipe: producer
      ? {
          category: producer.category,
          energyRequired: producer.energy_required,
          productivity: producer.allow_productivity,
        }
      : undefined,
    ingredients: producer ? ingredientList(producer.ingredients) : undefined,
    results: producer ? resultList(producer.results) : undefined,
  };
}

function buildRecipeEntry(recipe: RawRecipe): CatalogEntry {
  const outputs = resultList(recipe.results);
  const primaryOutput = outputs[0]?.name ?? recipe.key.replace(/-/g, ' ');
  const ingredientSummary = recipe.ingredients
    .map((ingredient) => `${formatAmount(ingredient.amount)} x ${ingredient.name.replace(/-/g, ' ')}`)
    .join(', ');

  return {
    key: `recipe:${recipe.key}`,
    kind: 'recipe',
    name: nameOf(recipe.localized_name, recipe.key.replace(/-/g, ' ')),
    subtitle: `Makes ${primaryOutput}`,
    description: `Imported from the Kirk recipe graph. Inputs: ${ingredientSummary}.`,
    tags: ['recipe', recipe.category, recipe.subgroup],
    icon: sprite(recipe.icon_row, recipe.icon_col, recipe.key),
    metrics: [
      { label: 'Category', value: recipe.category },
      { label: 'Time', value: `${recipe.energy_required} s` },
      { label: 'Productivity', value: recipe.allow_productivity ? 'Allowed' : 'Blocked' },
    ],
    ingredients: ingredientList(recipe.ingredients),
    results: outputs,
    recipe: {
      category: recipe.category,
      energyRequired: recipe.energy_required,
      productivity: recipe.allow_productivity,
    },
    featured: featuredKeys.has(`recipe:${recipe.key}`),
  };
}

function buildMachineEntry(machine: RawMachine, prefix: string): CatalogEntry {
  const categoryList = machine.crafting_categories ?? [];
  const emissions =
    machine.energy_source?.emissions_per_minute &&
    Object.entries(machine.energy_source.emissions_per_minute)
      .map(([key, value]) => `${value} ${key}/min`)
      .join(', ');

  return {
    key: `machine:${machine.key}`,
    kind: 'machine',
    name: nameOf(machine.localized_name, machine.key.replace(/-/g, ' ')),
    subtitle: `${prefix} machine`,
    description: `Imported machine data from Kirk's dataset for ${machine.key}.`,
    tags: ['machine', prefix, ...(categoryList.length ? categoryList : ['utility'])],
    icon: sprite(machine.icon_row ?? 0, machine.icon_col ?? 0, machine.key),
    metrics: [
      { label: 'Categories', value: categoryList.length ? categoryList.join(', ') : 'n/a' },
      { label: 'Speed', value: machine.crafting_speed !== undefined ? String(machine.crafting_speed) : 'n/a' },
      { label: 'Modules', value: machine.module_slots !== undefined ? String(machine.module_slots) : 'n/a' },
      { label: 'Energy', value: machine.energy_usage !== undefined ? `${machine.energy_usage / 1000} kW` : 'n/a' },
    ],
    machine: {
      categories: categoryList,
      craftingSpeed: machine.crafting_speed ?? 0,
      moduleSlots: machine.module_slots ?? 0,
      energyUsage: machine.energy_usage !== undefined ? `${machine.energy_usage / 1000} kW` : 'n/a',
      emissions: emissions || 'n/a',
    },
    featured: featuredKeys.has(`machine:${machine.key}`),
  };
}

function buildModuleEntry(module: RawModule): CatalogEntry {
  const item = itemByKey.get(module.item_key);
  const effects = Object.entries(module.effect)
    .map(([name, value]) => {
      const percent = value * 100;
      const sign = percent >= 0 ? '+' : '';
      return `${sign}${percent.toFixed(0)}% ${name}`;
    })
    .sort();

  return {
    key: `module:${module.item_key}`,
    kind: 'module',
    name: nameOf(item?.localized_name, module.item_key.replace(/-/g, ' ')),
    subtitle: `${module.category} module`,
    description: `Imported module definition with ${effects.join(', ')}.`,
    tags: ['module', module.category],
    icon: sprite(item?.icon_row ?? 0, item?.icon_col ?? 0, module.item_key),
    metrics: [
      { label: 'Category', value: module.category },
      { label: 'Effect count', value: String(effects.length) },
      { label: 'Source item', value: module.item_key },
    ],
    module: {
      category: module.category,
      effects,
    },
    featured: featuredKeys.has(`module:${module.item_key}`),
  };
}

function buildFuelEntry(fuel: RawFuel): CatalogEntry {
  const item = itemByKey.get(fuel.item_key);
  return {
    key: `fuel:${fuel.item_key}`,
    kind: 'fuel',
    name: nameOf(item?.localized_name, fuel.item_key.replace(/-/g, ' ')),
    subtitle: `${fuel.category} fuel`,
    description: `Imported energy source with a value of ${fuel.value}.`,
    tags: ['fuel', fuel.category],
    icon: sprite(item?.icon_row ?? 0, item?.icon_col ?? 0, fuel.item_key),
    metrics: [
      { label: 'Category', value: fuel.category },
      { label: 'Energy', value: `${fuel.value}` },
      { label: 'Source item', value: fuel.item_key },
    ],
    fuel: {
      category: fuel.category,
      value: String(fuel.value),
    },
    featured: featuredKeys.has(`fuel:${fuel.item_key}`),
  };
}

function buildPlanetEntry(planet: RawPlanet): CatalogEntry {
  const cycle = planet.surface_properties?.['day-night-cycle'];
  const resources = [
    ...(planet.resources?.resource ?? []),
    ...(planet.resources?.offshore ?? []),
    ...(planet.resources?.plants ?? []),
  ];

  return {
    key: `planet:${planet.key}`,
    kind: 'planet',
    name: nameOf(planet.localized_name, planet.key),
    subtitle: 'Planning surface',
    description: `Imported planet data for ${planet.key}.`,
    tags: ['planet', 'surface'],
    icon: sprite(planet.icon_row, planet.icon_col, planet.key),
    metrics: [
      { label: 'Resources', value: resources.length ? String(resources.length) : 'n/a' },
      { label: 'Cycle', value: cycle ? `${cycle} ticks` : 'n/a' },
      { label: 'Surface', value: planet.key },
    ],
    planet: {
      resources,
      cycle: cycle ? `${cycle} ticks` : 'n/a',
    },
    featured: featuredKeys.has(`planet:${planet.key}`),
  };
}

const machineSources: Array<[string, RawMachine[] | undefined]> = [
  ['crafting', dataset.crafting_machines],
  ['mining', dataset.mining_drills],
  ['boiler', dataset.boilers],
  ['pump', dataset.offshore_pumps],
  ['silo', dataset.rocket_silo],
  ['agriculture', dataset.agricultural_tower],
];

const generatedEntries: CatalogEntry[] = [
  ...dataset.items.map(buildItemEntry),
  ...dataset.recipes.map(buildRecipeEntry),
  ...machineSources.flatMap(([prefix, machines]) => (machines ?? []).map((machine) => buildMachineEntry(machine, prefix))),
  ...dataset.modules.map(buildModuleEntry),
  ...dataset.fuel.map(buildFuelEntry),
  ...dataset.planets.map(buildPlanetEntry),
];

export const catalogEntries = generatedEntries;

export const dashboardSignals = [
  { label: 'Imported entries', value: String(catalogEntries.length) },
  { label: 'Items', value: String(dataset.items.length) },
  { label: 'Recipes', value: String(dataset.recipes.length) },
  { label: 'Sprite atlas', value: dataset.sprites.hash.slice(0, 8) },
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

export const workspaceTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'factory', label: 'Factory' },
  { key: 'library', label: 'Library' },
  { key: 'blueprints', label: 'Blueprints' },
  { key: 'planets', label: 'Planets' },
  { key: 'settings', label: 'Settings' },
] as const;

export const kirkDatasetInfo = {
  version: 'vanilla-2.0.55',
  spriteSize: `${KIRK_SPRITE_CELL}x${KIRK_SPRITE_CELL}`,
  itemCount: dataset.items.length,
  recipeCount: dataset.recipes.length,
  machineCount: machineSources.reduce((sum, [, entries]) => sum + (entries?.length ?? 0), 0),
  moduleCount: dataset.modules.length,
  fuelCount: dataset.fuel.length,
  planetCount: dataset.planets.length,
};

