import { quickActions, dashboardSignals } from '../data/kirkCatalog';

interface HeroPanelProps {
  workspace: string;
  onQuickAction: (key: string) => void;
}

const copy = {
  overview: {
    eyebrow: 'Factory command center',
    title: 'A dashboard that can grow into the whole lab.',
    subtitle:
      'We are starting with a polished overview surface and a clean domain layer that can absorb the Kirk calculator logic later.',
  },
  factory: {
    eyebrow: 'Factory view',
    title: 'Production chains, machines, and the pressure points between them.',
    subtitle:
      'The factory workspace keeps the recipe graph close at hand so the next phases can become calculation-ready without a redesign.',
  },
  library: {
    eyebrow: 'Library view',
    title: 'A browseable domain catalog for items, modules, and fuels.',
    subtitle:
      'This workspace is about fast lookup, reuse, and surfacing the data primitives that the calculator core will consume.',
  },
  blueprints: {
    eyebrow: 'Blueprint view',
    title: 'A future home for planning, layout, and blueprint workflows.',
    subtitle:
      'This phase seeds the shell and vocabulary for blueprint workflows without forcing a premature implementation.',
  },
  planets: {
    eyebrow: 'Planet view',
    title: 'Surface planning starts with understanding the planet first.',
    subtitle:
      'The planet workspace gives the lab room for production, resource, and surface-level planning later on.',
  },
  settings: {
    eyebrow: 'System view',
    title: 'A disciplined foundation with validation and source traceability.',
    subtitle:
      'The settings view keeps the imported data honest so the future calculator work can stand on a stable base.',
  },
} as const;

export function HeroPanel({ workspace, onQuickAction }: HeroPanelProps) {
  const hero = copy[workspace as keyof typeof copy] ?? copy.overview;

  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="hero-eyebrow">{hero.eyebrow}</span>
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
      </div>

      <div className="hero-actions">
        {quickActions.map((action) => (
          <button key={action.title} type="button" className={`action-card action-${action.accent}`} onClick={() => onQuickAction(action.targetKey)}>
            <span className="action-title">{action.title}</span>
            <span className="action-description">{action.description}</span>
          </button>
        ))}
      </div>

      <div className="signal-grid">
        {dashboardSignals.map((signal) => (
          <article key={signal.label} className="signal-card">
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
