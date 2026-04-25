type ProgressCardProps = {
  label: string;
  value: string | number;
  caption?: string;
};

export const ProgressCard = ({ label, value, caption }: ProgressCardProps) => (
  <article className="rounded-xl border border-line bg-panel p-5">
    <p className="text-sm font-medium text-muted">{label}</p>
    <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    {caption ? <p className="mt-2 text-sm text-muted">{caption}</p> : null}
  </article>
);
