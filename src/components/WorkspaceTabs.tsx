import { workspaceTabs } from '../data/kirkCatalog';

interface WorkspaceTabsProps {
  active: string;
  onChange: (workspace: string) => void;
}

export function WorkspaceTabs({ active, onChange }: WorkspaceTabsProps) {
  return (
    <nav className="workspace-tabs" aria-label="Workspace navigation">
      {workspaceTabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`workspace-tab ${active === tab.key ? 'is-active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
