import { useEffect, useMemo, useState } from 'react';
import { SpriteIcon } from './components/SpriteIcon';
import { catalogEntries } from './data/kirkCatalog';
import type { CatalogEntry } from './data/catalogTypes';
import {
  buildBlueprintConfig,
  buildRecipeTree,
  cellId,
  createDefaultPorts,
  getAllowedMachineKeys,
  getBorderCells,
  getDefaultRecipeKey,
  getRecommendedMachineForRecipe,
  getRecipeInputOptions,
  getRecipeOutputOptions,
  getProfileByKey,
  gridPresets,
  machineEntries,
  researchProfiles,
  recipeEntries,
  type GridSize,
  type PortCell,
  type PortSlot,
  type RecipeTreeNode,
} from './lib/configuration';
import { validateCatalog } from './lib/catalog';
import './styles/global.css';

const validation = validateCatalog(catalogEntries);

function clampGridSize(size: GridSize): GridSize {
  return {
    width: Math.max(6, Math.min(30, Math.floor(size.width || 12))),
    height: Math.max(6, Math.min(30, Math.floor(size.height || 12))),
  };
}

function normalizePortsForGrid(ports: PortSlot[], grid: GridSize): PortSlot[] {
  const valid = new Set(getBorderCells(grid).map(cellId));
  return ports.map((slot) => (slot.cell && valid.has(cellId(slot.cell)) ? slot : { ...slot, cell: null }));
}

function normalizePortsForRecipe(ports: PortSlot[], recipeKey: string): PortSlot[] {
  const inputKeys = new Set(getRecipeInputOptions(recipeKey).map((option) => option.key));
  const outputKeys = new Set(getRecipeOutputOptions(recipeKey).map((option) => option.key));

  return ports.map((slot) => {
    if (slot.kind === 'input' && slot.bindingKey && !inputKeys.has(slot.bindingKey)) {
      return { ...slot, bindingKey: null, bindingLabel: null };
    }
    if (slot.kind === 'output' && slot.bindingKey && !outputKeys.has(slot.bindingKey)) {
      return { ...slot, bindingKey: null, bindingLabel: null };
    }
    return slot;
  });
}

function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return 'Unknown';
  return Number.isInteger(value) ? value.toString() : value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

function formatAmountMaybe(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return 'Unknown';
  return formatAmount(value);
}

function renderRecipeNode(
  node: RecipeTreeNode,
  path: string,
  context: {
    allowedMachineKeys: string[];
    targetOutput: number;
  },
  requiredAmount: number,
  depth = 0,
): JSX.Element {
  const outputsPerCraft = Math.max(1, node.amount || 1);
  const perOutputAmount = requiredAmount / context.targetOutput;
  const craftsNeeded = node.kind === 'recipe' ? requiredAmount / outputsPerCraft : null;
  const machine = node.kind === 'recipe' ? getRecommendedMachineForRecipe(node.recipeKey ?? node.key, context.allowedMachineKeys) : null;
  const iconEntry =
    node.kind === 'recipe'
      ? catalogEntries.find((entry) => entry.key === (node.recipeKey ?? node.key)) ?? null
      : catalogEntries.find((entry) => entry.key === node.key) ?? null;
  const childNodes = node.children ?? [];

  return (
    <div key={path} className={`tree-node tree-depth-${depth}`}>
      <div className={`node-card ${node.kind}`}>
        <div className="tree-node-head">
          <div className="tree-node-icon">
            <SpriteIcon sprite={iconEntry?.icon ?? machine?.icon ?? recipeEntries[0].icon} size={34} className="tree-icon" />
          </div>
          <div className="tree-node-main">
            <div className="tree-node-title">
              <strong>{node.label}</strong>
              <span>{node.kind === 'recipe' ? 'Final recipe' : node.producerName ? 'Intermediate item' : 'Raw input'}</span>
            </div>
            <div className="tree-node-rates">
              <span>Per 1 output: <strong>{formatAmountMaybe(perOutputAmount)}</strong></span>
              <span>
                {context.targetOutput} output{context.targetOutput === 1 ? '' : 's'}: <strong>{formatAmountMaybe(requiredAmount)}</strong>
              </span>
            </div>
          </div>
        </div>
        <div className="tree-node-body">
          <div className="tree-chip-row">
            <span className="tree-chip">{formatAmountMaybe(node.amount)} / craft</span>
            {node.rate ? <span className="tree-chip tree-chip-muted">{node.rate}</span> : null}
            {node.producerName ? <span className="tree-chip">From {node.producerName}</span> : null}
            {node.note ? <span className="tree-chip tree-chip-muted">{node.note}</span> : null}
            {node.kind === 'recipe' ? <span className="tree-chip">{formatAmountMaybe(craftsNeeded)}</span> : null}
            {machine ? (
              <span className="tree-chip tree-chip-machine">
                <SpriteIcon sprite={machine.icon} size={16} className="tree-chip-icon" />
                {machine.name}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {childNodes.length > 0 ? <div className="connector-vertical" aria-hidden="true" /> : null}
      {childNodes.length > 0 ? <div className="connector-horizontal" aria-hidden="true" /> : null}

      {childNodes.length > 0 ? (
        <div className="children-row">
          {childNodes.map((child, index) => {
            const nextRequiredAmount =
              node.kind === 'recipe' ? child.amount * (requiredAmount / outputsPerCraft) : requiredAmount;
            return (
              <div key={`${path}-${index}`} className="child-subtree">
                <div className="connector-vertical child" aria-hidden="true" />
                {renderRecipeNode(child, `${path}-${index}`, context, nextRequiredAmount, depth + 1)}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

interface SummaryOccurrence {
  path: string;
  amount: number;
}

interface SummaryRow {
  key: string;
  label: string;
  total: number;
  kind: 'raw' | 'intermediate' | 'final';
  icon: CatalogEntry['icon'];
  breakdown: SummaryOccurrence[];
  note?: string;
}

function findCatalogEntryByKey(key: string): CatalogEntry | null {
  return catalogEntries.find((entry) => entry.key === key) ?? null;
}

function isCraftableItem(key: string): boolean {
  return recipeEntries.some((recipe) => recipe.results?.some((result) => result.key === key));
}

function buildAggregatedSummary(root: RecipeTreeNode | null, targetOutput: number, finalRecipe: CatalogEntry | null): {
  raw: SummaryRow[];
  intermediate: SummaryRow[];
  final: SummaryRow[];
} {
  if (!root) {
    return { raw: [], intermediate: [], final: [] };
  }

  const summaryMap = new Map<string, SummaryRow>();
  const rootOutputsPerCraft = Math.max(1, root.amount || 1);

  const addOccurrence = (node: RecipeTreeNode, amount: number, path: string[]) => {
    const itemEntry = findCatalogEntryByKey(node.key);
    const kind: SummaryRow['kind'] = isCraftableItem(node.key) ? 'intermediate' : 'raw';
    const existing = summaryMap.get(node.key);
    const label = itemEntry?.name ?? node.label;
    const occurrence: SummaryOccurrence = {
      path: path.join(' → '),
      amount,
    };

    if (existing) {
      existing.total += amount;
      existing.breakdown.push(occurrence);
      return;
    }

    summaryMap.set(node.key, {
      key: node.key,
      label,
      total: amount,
      kind,
      icon: itemEntry?.icon ?? findCatalogEntryByKey(root.key)?.icon ?? recipeEntries[0].icon,
      breakdown: [occurrence],
      note: node.note,
    });
  };

  const walk = (node: RecipeTreeNode, amount: number, path: string[]) => {
    if (node.kind === 'ingredient') {
      addOccurrence(node, amount, path);
    }

    const outputsPerCraft = Math.max(1, node.amount || 1);
    for (const child of node.children ?? []) {
      const nextAmount = node.kind === 'recipe' ? child.amount * (amount / outputsPerCraft) : amount;
      walk(child, nextAmount, [...path, node.label]);
    }
  };

  for (const child of root.children ?? []) {
    walk(child, child.amount * (targetOutput / rootOutputsPerCraft), [root.label]);
  }

  const rows = [...summaryMap.values()].sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
  const raw = rows.filter((row) => row.kind === 'raw');
  const intermediate = rows.filter((row) => row.kind === 'intermediate');
  const finalRow: SummaryRow = {
    key: finalRecipe?.key ?? root.key,
    label: finalRecipe?.results?.[0]?.name ?? root.label,
    total: targetOutput,
    kind: 'final',
    icon: finalRecipe?.icon ?? findCatalogEntryByKey(root.key)?.icon ?? recipeEntries[0].icon,
    breakdown: [{ path: `Selected output scale`, amount: targetOutput }],
    note: finalRecipe?.subtitle,
  };

  return {
    raw,
    intermediate,
    final: [finalRow],
  };
}

function formatExport(config: unknown): string {
  return JSON.stringify(config, null, 2);
}

export default function App() {
  const [grid, setGrid] = useState<GridSize>({ width: 12, height: 12 });
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeKey, setRecipeKey] = useState(getDefaultRecipeKey());
  const [profileKey, setProfileKey] = useState('starter');
  const [ports, setPorts] = useState<PortSlot[]>(createDefaultPorts());
  const [activePortId, setActivePortId] = useState('input-1');
  const [customWidth, setCustomWidth] = useState('12');
  const [customHeight, setCustomHeight] = useState('12');
  const [targetOutput, setTargetOutput] = useState('1');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const selectedRecipe = recipeEntries.find((entry) => entry.key === recipeKey) ?? recipeEntries[0];
  const targetOutputValue = Math.max(1, Number(targetOutput) || 1);
  const profile = getProfileByKey(profileKey);
  const allowedMachineKeys = getAllowedMachineKeys(profileKey);
  const allowedMachines = useMemo(() => {
    const keys = new Set(allowedMachineKeys);
    return machineEntries.filter((machine) => keys.has(machine.key));
  }, [allowedMachineKeys]);
  const recipeTree = buildRecipeTree(selectedRecipe.key);
  const aggregatedSummary = useMemo(() => buildAggregatedSummary(recipeTree, targetOutputValue, selectedRecipe), [recipeTree, targetOutputValue, selectedRecipe]);
  const assignedByCell = new Map(ports.filter((slot) => slot.cell).map((slot) => [cellId(slot.cell as PortCell), slot]));
  const exportConfig = buildBlueprintConfig(grid, selectedRecipe.key, targetOutputValue, profileKey, allowedMachineKeys, ports);
  const exportJson = formatExport(exportConfig);
  const activePort = ports.find((slot) => slot.id === activePortId) ?? null;
  const inputOptions = getRecipeInputOptions(selectedRecipe.key);
  const outputOptions = getRecipeOutputOptions(selectedRecipe.key);

  useEffect(() => {
    if (ports.some((slot) => slot.id === activePortId)) return;
    setActivePortId(ports[0]?.id ?? '');
  }, [activePortId, ports]);

  const filteredRecipes = recipeEntries.filter((entry) => {
    const term = recipeSearch.trim().toLowerCase();
    if (!term) return true;
    return [entry.name, entry.subtitle, entry.description, entry.key, ...entry.tags].join(' ').toLowerCase().includes(term);
  });

  function applyGridSize(next: GridSize) {
    const normalized = clampGridSize(next);
    setGrid(normalized);
    setPorts((current) => normalizePortsForGrid(current, normalized));
    setCustomWidth(String(normalized.width));
    setCustomHeight(String(normalized.height));
  }

  function selectRecipe(nextKey: string) {
    setRecipeKey(nextKey);
    setPorts((current) => normalizePortsForRecipe(current, nextKey));
  }

  function assignPortToCell(slotId: string, cell: PortCell) {
    setPorts((current) =>
      current.map((slot) => {
        if (slot.id === slotId) {
          if (slot.cell && cellId(slot.cell) === cellId(cell)) {
            return { ...slot, cell: null };
          }
          return { ...slot, cell };
        }
        if (slot.cell && cellId(slot.cell) === cellId(cell)) {
          return { ...slot, cell: null };
        }
        return slot;
      }),
    );
  }

  function addInputPort(binding?: { key: string; label: string }) {
    const nextIndex = ports.filter((slot) => slot.kind === 'input').length + 1;
    const nextId = `input-${nextIndex}`;
    setPorts((current) => [
      ...current,
      {
        id: nextId,
        kind: 'input',
        label: `Input ${nextIndex}`,
        cell: null,
        bindingKey: binding?.key ?? null,
        bindingLabel: binding?.label ?? null,
      },
    ]);
    setActivePortId(nextId);
  }

  function addOutputPort(binding?: { key: string; label: string }) {
    const nextIndex = ports.filter((slot) => slot.kind === 'output').length + 1;
    const nextId = `output-${nextIndex}`;
    setPorts((current) => [
      ...current,
      {
        id: nextId,
        kind: 'output',
        label: `Output ${nextIndex}`,
        cell: null,
        bindingKey: binding?.key ?? null,
        bindingLabel: binding?.label ?? null,
      },
    ]);
    setActivePortId(nextId);
  }

  function updatePortBinding(slotId: string, bindingKey: string) {
    const inputOption = inputOptions.find((option) => option.key === bindingKey);
    const outputOption = outputOptions.find((option) => option.key === bindingKey);
    const binding = inputOption ?? outputOption ?? null;

    setPorts((current) =>
      current.map((slot) => {
        if (slot.id !== slotId) return slot;
        if (!binding) {
          return { ...slot, bindingKey: null, bindingLabel: null };
        }
        return { ...slot, bindingKey: binding.key, bindingLabel: binding.label };
      }),
    );
  }

  function removePort(slotId: string) {
    setPorts((current) => current.filter((slot) => slot.id !== slotId));
  }

  async function copyExportJson() {
    try {
      await navigator.clipboard.writeText(exportJson);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1200);
    } catch {
      setCopyState('idle');
    }
  }

  const machineCompatibility = machineEntries.map((machine) => {
    const compatible =
      !!selectedRecipe.recipe &&
      machine.machine?.categories?.includes(selectedRecipe.recipe.category) &&
      allowedMachineKeys.includes(machine.key);
    const unlockOnly =
      !!selectedRecipe.recipe &&
      machine.machine?.categories?.includes(selectedRecipe.recipe.category) &&
      !allowedMachineKeys.includes(machine.key);
    return { machine, compatible, unlockOnly };
  });

  return (
    <div className="page-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Factorio Blueprint Lab</p>
          <h1>Configuration Dashboard</h1>
          <p className="subtle">
            Set the grid, choose a recipe, assign input/output ports, and export the configuration for the next phase.
          </p>
        </div>
        <div className="top-bar-actions">
          <button type="button" className="ghost-button" onClick={copyExportJson}>
            {copyState === 'copied' ? 'Copied JSON' : 'Copy JSON'}
          </button>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="config-column">
          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Grid size</p>
                <h2>Choose the blueprint frame</h2>
              </div>
            </div>

            <div className="preset-row">
              {gridPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={`pill ${preset.size.width === grid.width && preset.size.height === grid.height ? 'is-active' : ''}`}
                  onClick={() => applyGridSize(preset.size)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="inline-fields">
              <label>
                <span>Width</span>
                <input
                  type="number"
                  min={6}
                  max={30}
                  value={customWidth}
                  onChange={(event) => setCustomWidth(event.target.value)}
                  onBlur={() => applyGridSize({ width: Number(customWidth), height: grid.height })}
                />
              </label>
              <label>
                <span>Height</span>
                <input
                  type="number"
                  min={6}
                  max={30}
                  value={customHeight}
                  onChange={(event) => setCustomHeight(event.target.value)}
                  onBlur={() => applyGridSize({ width: grid.width, height: Number(customHeight) })}
                />
              </label>
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Recipe list</p>
                <h2>Select the machine recipe</h2>
              </div>
            </div>

            <label className="search-label">
              <span>Search recipes</span>
              <input
                type="search"
                placeholder="Type to filter recipes"
                value={recipeSearch}
                onChange={(event) => setRecipeSearch(event.target.value)}
              />
            </label>

            <div className="recipe-list">
              {filteredRecipes.map((entry) => (
                <button
                  key={entry.key}
                  type="button"
                  className={`recipe-row ${recipeKey === entry.key ? 'is-active' : ''}`}
                  onClick={() => selectRecipe(entry.key)}
                >
                  <SpriteIcon sprite={entry.icon} size={42} className="recipe-icon" />
                  <span className="recipe-copy">
                    <strong>{entry.name}</strong>
                    <span>{entry.subtitle}</span>
                  </span>
                </button>
              ))}

              {filteredRecipes.length === 0 ? (
                <div className="empty-note">No recipes match that search.</div>
              ) : null}
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Allowed machines</p>
                <h2>Research profile</h2>
              </div>
            </div>

            <label className="search-label">
              <span>Unlock profile</span>
              <select value={profileKey} onChange={(event) => setProfileKey(event.target.value)}>
                {researchProfiles.map((profileOption) => (
                  <option key={profileOption.key} value={profileOption.key}>
                    {profileOption.label}
                  </option>
                ))}
              </select>
            </label>

            <p className="subtle">{profile.description}</p>

            <div className="machine-list">
              {allowedMachines.map((machine) => (
                <div key={machine.key} className="machine-row">
                  <SpriteIcon sprite={machine.icon} size={36} className="machine-icon" />
                  <div>
                    <strong>{machine.name}</strong>
                    <span>{machine.machine?.categories.join(', ') ?? 'machine'}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Ports</p>
                <h2>Assign input and output nodes</h2>
              </div>
              <div className="port-actions">
                <button type="button" className="ghost-button" onClick={() => addInputPort()}>
                  + Input node
                </button>
                <button type="button" className="ghost-button" onClick={() => addOutputPort()}>
                  + Output port
                </button>
              </div>
            </div>

            <div className="port-hints">
              <div className="port-hint-block">
                <strong>Suggested inputs</strong>
                <div className="port-chip-row">
                  {inputOptions.length > 0 ? (
                    inputOptions.map((option) => (
                      <button key={option.key} type="button" className="port-chip" onClick={() => addInputPort({ key: option.key, label: option.label })}>
                        {option.label}
                        <span>{option.amount}/craft</span>
                      </button>
                    ))
                  ) : (
                    <span className="subtle">No base inputs found for this recipe.</span>
                  )}
                </div>
              </div>

              <div className="port-hint-block">
                <strong>Outputs</strong>
                <div className="port-chip-row">
                  {outputOptions.length > 0 ? (
                    outputOptions.map((option) => (
                      <button key={option.key} type="button" className="port-chip" onClick={() => addOutputPort({ key: option.key, label: option.label })}>
                        {option.label}
                        <span>{option.amount}x</span>
                      </button>
                    ))
                  ) : (
                    <span className="subtle">No outputs found for this recipe.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="port-slot-list">
              {ports.map((slot) => (
                <div key={slot.id} className={`port-slot ${activePortId === slot.id ? 'is-active' : ''}`}>
                  <div className="port-slot-head">
                    <button type="button" className="port-slot-select" onClick={() => setActivePortId(slot.id)}>
                      <span>{slot.label}</span>
                      <strong>{slot.cell ? `${slot.cell.side} ${slot.cell.index + 1}` : 'unassigned'}</strong>
                    </button>
                    <button type="button" className="port-remove" onClick={() => removePort(slot.id)}>
                      Remove
                    </button>
                  </div>
                  <label className="port-binding">
                    <span>{slot.kind === 'input' ? 'Bind to input' : 'Bind to output'}</span>
                    <select
                      value={slot.bindingKey ?? ''}
                      onChange={(event) => updatePortBinding(slot.id, event.target.value)}
                    >
                      <option value="">Unbound</option>
                      {slot.kind === 'input'
                        ? inputOptions.map((option) => (
                            <option key={option.key} value={option.key}>
                              {option.label}
                            </option>
                          ))
                        : outputOptions.map((option) => (
                            <option key={option.key} value={option.key}>
                              {option.label}
                            </option>
                          ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          </article>

          <article className="panel export-panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Export</p>
                <h2>Configuration JSON</h2>
              </div>
            </div>
            <pre className="export-box">{exportJson}</pre>
          </article>
        </section>

        <section className="grid-column">
          <article className="panel grid-panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Blueprint grid</p>
                <h2>{grid.width} x {grid.height}</h2>
              </div>
              <div className="grid-legend">
                <span className="legend-chip input">Input</span>
                <span className="legend-chip output">Output</span>
                <span className="legend-chip empty">Empty</span>
              </div>
            </div>

            <p className="subtle">
              Click a perimeter box to assign the currently selected port slot. Interior cells stay empty for now.
            </p>

            <div
              className="blueprint-grid"
              style={{
                gridTemplateColumns: `repeat(${grid.width + 2}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${grid.height + 2}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: (grid.width + 2) * (grid.height + 2) }, (_, index) => {
                const x = index % (grid.width + 2);
                const y = Math.floor(index / (grid.width + 2));
                const border = x === 0 || y === 0 || x === grid.width + 1 || y === grid.height + 1;
                const cell = border
                  ? x === 0
                    ? { x, y, side: 'left' as const, index: y - 1 }
                    : y === 0
                      ? { x, y, side: 'top' as const, index: x - 1 }
                      : x === grid.width + 1
                        ? { x, y, side: 'right' as const, index: y - 1 }
                        : { x, y, side: 'bottom' as const, index: grid.width - x }
                  : null;
                const assigned = cell ? assignedByCell.get(cellId(cell)) : null;
                const active = !!cell && !!activePort?.cell && cellId(activePort.cell) === cellId(cell);
                const padLabel = cell
                  ? `${cell.side[0].toUpperCase()}${cell.index + 1}`
                  : '';
                const padName = cell ? `${cell.side.charAt(0).toUpperCase()}${cell.side.slice(1)} ${cell.index + 1}` : '';

                return (
                  <button
                    key={`${x}-${y}`}
                    type="button"
                    className={[
                      'grid-cell',
                      border ? 'is-border' : 'is-inner',
                      assigned ? `assigned ${assigned.kind}` : 'empty',
                      active ? 'is-active' : '',
                    ].join(' ')}
                    onClick={() => {
                      if (!cell) return;
                      assignPortToCell(activePortId, cell);
                    }}
                  >
                    {assigned ? (
                      <span className="pad-card">
                        <span className="cell-pad-name">{padName}</span>
                        <span className="cell-label">{assigned.label}</span>
                        <span className="cell-sub">
                          {assigned.bindingLabel ?? assigned.kind}
                          {assigned.bindingLabel ? ` • ${assigned.kind}` : ''}
                        </span>
                      </span>
                    ) : border ? (
                      <span className="pad-card">
                        <span className="cell-pad-name">{padName}</span>
                        <span className="cell-pad-code">{padLabel}</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </article>
        </section>

        <aside className="detail-column">
          <article className="panel detail-panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Recipe detail</p>
                <h2>{selectedRecipe.name}</h2>
              </div>
            </div>

            <div className="detail-lead">
              <SpriteIcon sprite={selectedRecipe.icon} size={60} className="detail-icon" />
              <div>
                <p className="subtle">{selectedRecipe.subtitle}</p>
                <div className="detail-metrics">
                  {selectedRecipe.metrics.map((metric) => (
                    <div key={metric.label} className="metric-card">
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section className="detail-section">
              <div className="detail-section-head">
                <h3>Recipe flow</h3>
                <label className="scale-control">
                  <span>Scale to outputs</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={targetOutput}
                    onChange={(event) => setTargetOutput(event.target.value)}
                  />
                </label>
              </div>
              <p className="subtle">
                This view shows the recipe as a flow of cards, with numbers scaled to produce {targetOutputValue} output{targetOutputValue === 1 ? '' : 's'}.
              </p>
              <div className="tree-scroll">
                <div className="tree-canvas" key={selectedRecipe.key}>
                {recipeTree ? (
                  renderRecipeNode(
                    recipeTree,
                    recipeTree.key,
                    {
                      allowedMachineKeys,
                      targetOutput: targetOutputValue,
                    },
                    targetOutputValue,
                  )
                ) : (
                  <div className="empty-note">No recipe tree available.</div>
                )}
                </div>
              </div>
            </section>

            <section className="detail-section">
              <div className="detail-section-head">
                <h3>Aggregated totals</h3>
              </div>
              <div className="summary-panel">
                <div className="summary-group">
                  <h4>Final output</h4>
                  {aggregatedSummary.final.map((row) => (
                    <details key={row.key} className="summary-item" open>
                      <summary className="summary-row">
                        <div className="summary-row-main">
                          <SpriteIcon sprite={row.icon} size={28} className="summary-icon" />
                          <div className="summary-copy">
                            <strong>{row.label}</strong>
                            <span>Final output</span>
                          </div>
                        </div>
                        <div className="summary-row-total">
                          <strong>{formatAmountMaybe(row.total)}</strong>
                        </div>
                      </summary>
                      <div className="summary-breakdown">
                        {row.breakdown.map((entry) => (
                          <div key={`${row.key}-${entry.path}`} className="summary-breakdown-row">
                            <span>{entry.path}</span>
                            <strong>{formatAmountMaybe(entry.amount)}</strong>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>

                <div className="summary-group">
                  <h4>Raw inputs</h4>
                  {aggregatedSummary.raw.length > 0 ? (
                    aggregatedSummary.raw.map((row) => (
                      <details key={row.key} className="summary-item">
                        <summary className="summary-row">
                          <div className="summary-row-main">
                            <SpriteIcon sprite={row.icon} size={28} className="summary-icon" />
                            <div className="summary-copy">
                              <strong>{row.label}</strong>
                              <span>Raw input</span>
                            </div>
                          </div>
                          <div className="summary-row-total">
                            <strong>{formatAmountMaybe(row.total)}</strong>
                          </div>
                        </summary>
                        <div className="summary-breakdown">
                          {row.breakdown.map((entry) => (
                            <div key={`${row.key}-${entry.path}`} className="summary-breakdown-row">
                              <span>{entry.path}</span>
                              <strong>{formatAmountMaybe(entry.amount)}</strong>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))
                  ) : (
                    <div className="empty-note">No raw inputs found for this recipe.</div>
                  )}
                </div>

                <div className="summary-group">
                  <h4>Intermediate totals</h4>
                  {aggregatedSummary.intermediate.length > 0 ? (
                    aggregatedSummary.intermediate.map((row) => (
                      <details key={row.key} className="summary-item">
                        <summary className="summary-row">
                          <div className="summary-row-main">
                            <SpriteIcon sprite={row.icon} size={28} className="summary-icon" />
                            <div className="summary-copy">
                              <strong>{row.label}</strong>
                              <span>Craftable dependency</span>
                            </div>
                          </div>
                          <div className="summary-row-total">
                            <strong>{formatAmountMaybe(row.total)}</strong>
                          </div>
                        </summary>
                        <div className="summary-breakdown">
                          {row.breakdown.map((entry) => (
                            <div key={`${row.key}-${entry.path}`} className="summary-breakdown-row">
                              <span>{entry.path}</span>
                              <strong>{formatAmountMaybe(entry.amount)}</strong>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))
                  ) : (
                    <div className="empty-note">No intermediate totals found for this recipe.</div>
                  )}
                </div>
              </div>
            </section>

            <section className="detail-section">
              <h3>Outputs and timings</h3>
              <div className="info-list">
                <div className="info-row">
                  <span>Craft category</span>
                  <strong>{selectedRecipe.recipe?.category ?? 'n/a'}</strong>
                </div>
                <div className="info-row">
                  <span>Craft time</span>
                  <strong>{selectedRecipe.recipe ? `${selectedRecipe.recipe.energyRequired}s` : 'n/a'}</strong>
                </div>
                <div className="info-row">
                  <span>Outputs</span>
                  <strong>
                    {selectedRecipe.results?.map((result) => `${result.amount}x ${result.name}`).join(', ') ?? 'n/a'}
                  </strong>
                </div>
                <div className="info-row">
                  <span>Base rate</span>
                  <strong>{selectedRecipe.recipe ? `${(60 / selectedRecipe.recipe.energyRequired).toFixed(1)} crafts/min` : 'n/a'}</strong>
                </div>
              </div>
            </section>

            <section className="detail-section">
              <h3>Machine compatibility</h3>
              <div className="compat-list">
                {machineCompatibility.map(({ machine, compatible, unlockOnly }) => (
                  <div key={machine.key} className={`compat-row ${compatible ? 'ok' : unlockOnly ? 'locked' : 'muted'}`}>
                    <span>{machine.name}</span>
                    <strong>{compatible ? 'Allowed' : unlockOnly ? 'Locked by profile' : 'Not relevant'}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h3>Validation</h3>
              <div className="info-list">
                <div className="info-row">
                  <span>Catalog errors</span>
                  <strong>{validation.errors.length}</strong>
                </div>
                <div className="info-row">
                  <span>Catalog warnings</span>
                  <strong>{validation.warnings.length}</strong>
                </div>
              </div>
            </section>
          </article>
        </aside>
      </main>
    </div>
  );
}
