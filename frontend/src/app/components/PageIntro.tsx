import { ReactNode } from "react";

interface PageIntroProps {
  badge?: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  children?: ReactNode;
}

export function PageIntro({
  badge,
  title,
  description,
  secondaryDescription,
  children,
}: PageIntroProps) {
  return (
    <div className="mb-10">
      {badge && (
        <div className="mb-4 inline-flex items-center gap-2 border border-[#2d694f] bg-white px-4 py-2 text-sm font-semibold text-[#2d694f]">
          <div className="h-2 w-2 bg-[#7ebc45]" />
          <span>{badge}</span>
        </div>
      )}

      <h1 className="max-w-5xl text-4xl font-bold leading-tight text-[#2d694f] md:text-5xl">
        {title}
      </h1>

      <div className="mt-6 max-w-4xl space-y-4 text-xl leading-relaxed text-[#5f6368]">
        <p>{description}</p>
        {secondaryDescription && <p>{secondaryDescription}</p>}
      </div>

      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
