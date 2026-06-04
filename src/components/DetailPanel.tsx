import type { CatalogEntry } from '../data/catalogTypes';
import { SpriteIcon } from './SpriteIcon';

interface DetailPanelProps {
  entry: CatalogEntry;
  validation: { errors: string[]; warnings: string[] };
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="detail-block">
      <h3>{title}</h3>
      <ul className="detail-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function DetailPanel({ entry, validation }: DetailPanelProps) {
  return (
    <aside className="detail-panel">
      <header className="detail-hero">
        <SpriteIcon sprite={entry.icon} size={72} className="detail-icon" />
        <div>
          <p className="detail-kind">{entry.kind}</p>
          <h2>{entry.name}</h2>
          <p className="detail-subtitle">{entry.subtitle}</p>
        </div>
      </header>

      <p className="detail-description">{entry.description}</p>

      <div className="detail-metrics">
        {entry.metrics.map((metric) => (
          <article key={metric.label} className="detail-metric">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      {entry.ingredients?.length ? (
        <ListBlock
          title="Ingredients"
          items={entry.ingredients.map((ingredient) => `${ingredient.amount} x ${ingredient.name}`)}
        />
      ) : null}

      {entry.results?.length ? (
        <ListBlock
          title="Results"
          items={entry.results.map((result) => `${result.amount} x ${result.name}`)}
        />
      ) : null}

      {entry.recipe ? (
        <ListBlock
          title="Recipe"
          items={[
            `Category: ${entry.recipe.category}`,
            `Energy required: ${entry.recipe.energyRequired} s`,
            `Productivity allowed: ${entry.recipe.productivity ? 'Yes' : 'No'}`,
          ]}
        />
      ) : null}

      {entry.machine ? (
        <ListBlock
          title="Machine"
          items={[
            `Speed: ${entry.machine.craftingSpeed}`,
            `Module slots: ${entry.machine.moduleSlots}`,
            `Energy usage: ${entry.machine.energyUsage}`,
            `Emissions: ${entry.machine.emissions}`,
            `Categories: ${entry.machine.categories.join(', ')}`,
          ]}
        />
      ) : null}

      {entry.module ? (
        <ListBlock
          title="Module"
          items={[`Category: ${entry.module.category}`, ...entry.module.effects]}
        />
      ) : null}

      {entry.fuel ? (
        <ListBlock
          title="Fuel"
          items={[`Category: ${entry.fuel.category}`, `Value: ${entry.fuel.value}`]}
        />
      ) : null}

      {entry.planet ? (
        <ListBlock
          title="Planet"
          items={[`Cycle: ${entry.planet.cycle}`, `Resources: ${entry.planet.resources.join(', ')}`]}
        />
      ) : null}

      <section className="detail-block">
        <h3>Validation</h3>
        <ul className="detail-list">
          <li>{validation.errors.length === 0 ? 'No catalog errors detected' : `${validation.errors.length} error(s) detected`}</li>
          <li>{validation.warnings.length === 0 ? 'No catalog warnings' : `${validation.warnings.length} warning(s) detected`}</li>
        </ul>
      </section>

      <section className="detail-block">
        <h3>Tags</h3>
        <div className="chip-row">
          {entry.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}
