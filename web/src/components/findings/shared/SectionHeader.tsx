interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export function SectionHeader({ title, subtitle, description }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      {subtitle && (
        <p className="text-sm font-medium text-blue-400/80 mb-2 tracking-wide uppercase">
          {subtitle}
        </p>
      )}
      <h2 className="text-2xl font-bold text-white/90 mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-white/60 max-w-3xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
