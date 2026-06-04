import { EntryCard } from './EntryCard';
import type { CatalogEntry } from '../data/catalogTypes';

interface CatalogBrowserProps {
  entries: CatalogEntry[];
  activeKey: string;
  search: string;
  kind: string;
  onSearch: (value: string) => void;
  onKindChange: (value: string) => void;
  onSelect: (key: string) => void;
}

const kindOptions = ['all', 'item', 'recipe', 'machine', 'module', 'fuel', 'planet'];

export function CatalogBrowser({
  entries,
  activeKey,
  search,
  kind,
  onSearch,
  onKindChange,
  onSelect,
}: CatalogBrowserProps) {
  return (
    <section className="browser-panel">
      <header className="browser-header">
        <div>
          <p className="section-label">Catalog browser</p>
          <h2>Find the exact node, recipe, or machine you need.</h2>
        </div>
        <div className="browser-controls">
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search items, recipes, machines..."
            className="search-input"
          />
          <select value={kind} onChange={(event) => onKindChange(event.target.value)} className="kind-select">
            {kindOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </header>

      {entries.length > 0 ? (
        <div className="entry-list">
          {entries.map((entry) => (
            <EntryCard key={entry.key} entry={entry} selected={entry.key === activeKey} onClick={onSelect} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>No matches found.</strong>
          <p>Try a broader search term or switch the kind filter back to all.</p>
        </div>
      )}
    </section>
  );
}
