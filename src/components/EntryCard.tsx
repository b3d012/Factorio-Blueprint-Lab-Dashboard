import { SpriteIcon } from './SpriteIcon';
import type { CatalogEntry } from '../data/catalogTypes';

interface EntryCardProps {
  entry: CatalogEntry;
  selected: boolean;
  onClick: (key: string) => void;
}

export function EntryCard({ entry, selected, onClick }: EntryCardProps) {
  return (
    <button
      type="button"
      className={`entry-card ${selected ? 'is-selected' : ''}`}
      onClick={() => onClick(entry.key)}
    >
      <SpriteIcon sprite={entry.icon} size={48} className="entry-icon" />
      <span className="entry-copy">
        <span className="entry-topline">
          <span className="entry-kind">{entry.kind}</span>
          <span className="entry-key">{entry.key}</span>
        </span>
        <span className="entry-name">{entry.name}</span>
        <span className="entry-subtitle">{entry.subtitle}</span>
      </span>
    </button>
  );
}
