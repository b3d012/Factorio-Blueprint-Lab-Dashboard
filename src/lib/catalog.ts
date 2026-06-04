import type { CatalogEntry } from '../data/catalogTypes';

export interface CatalogAudit {
  errors: string[];
  warnings: string[];
}

export function validateCatalog(entries: CatalogEntry[]): CatalogAudit {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenKeys = new Set<string>();
  const knownKeys = new Set(entries.map((entry) => entry.key));

  for (const entry of entries) {
    if (seenKeys.has(entry.key)) {
      errors.push(`Duplicate key: ${entry.key}`);
    } else {
      seenKeys.add(entry.key);
    }

    if (!entry.name.trim()) {
      errors.push(`Missing display name for ${entry.key}`);
    }

    if (entry.icon.col < 0 || entry.icon.row < 0) {
      errors.push(`Invalid sprite coordinates for ${entry.key}`);
    }

    if (!entry.description.trim()) {
      warnings.push(`Empty description for ${entry.key}`);
    }

    if (entry.kind === 'recipe' && (!entry.ingredients?.length || !entry.results?.length)) {
      warnings.push(`Recipe entry lacks ingredients or results: ${entry.key}`);
    }

    for (const ingredient of entry.ingredients ?? []) {
      if (!knownKeys.has(ingredient.key)) {
        warnings.push(`Unresolved ingredient reference ${ingredient.key} in ${entry.key}`);
      }
    }

    for (const result of entry.results ?? []) {
      if (!knownKeys.has(result.key)) {
        warnings.push(`Unresolved result reference ${result.key} in ${entry.key}`);
      }
    }
  }

  return { errors, warnings };
}

export function filterCatalog(
  entries: CatalogEntry[],
  search: string,
  kind: string,
  workspace: string,
): CatalogEntry[] {
  const term = search.trim().toLowerCase();

  return entries.filter((entry) => {
    const matchesWorkspace =
      workspace === 'overview'
        ? entry.featured !== false
        : workspace === 'factory'
          ? entry.kind === 'recipe' || entry.kind === 'machine'
          : workspace === 'library'
            ? entry.kind === 'item' || entry.kind === 'module' || entry.kind === 'fuel'
            : workspace === 'blueprints'
              ? entry.kind === 'recipe' || entry.kind === 'machine' || entry.kind === 'item'
              : workspace === 'planets'
                ? entry.kind === 'planet'
                : true;

    const matchesKind = kind === 'all' ? true : entry.kind === kind;
    const haystack = [entry.key, entry.name, entry.subtitle, entry.description, ...entry.tags]
      .join(' ')
      .toLowerCase();
    const matchesSearch = term.length === 0 ? true : haystack.includes(term);

    return matchesWorkspace && matchesKind && matchesSearch;
  });
}
