interface StatCardProps {
  label: string;
  value: string;
  note?: string;
  tone?: 'amber' | 'cyan' | 'violet' | 'green';
}

export function StatCard({ label, value, note, tone = 'amber' }: StatCardProps) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {note ? <span className="stat-note">{note}</span> : null}
    </article>
  );
}
