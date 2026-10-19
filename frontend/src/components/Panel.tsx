import type { ReactNode } from "react";

interface PanelProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
  rightContent?: ReactNode;
}

export default function Panel({
  eyebrow,
  title,
  children,
  className = "",
  rightContent,
}: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-header">
        <div>
          <span className="eyebrow">
            {eyebrow}
          </span>

          <h3>{title}</h3>
        </div>

        {rightContent && (
          <div>{rightContent}</div>
        )}
      </div>

      {children}
    </section>
  );
}