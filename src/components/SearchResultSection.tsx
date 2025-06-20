import { ReactNode } from "react";

interface SearchResultSectionProps {
  title?: string;
  children: ReactNode;
  fullPage?: boolean;
}

function SearchResultSection({
  title,
  children,
  fullPage,
}: SearchResultSectionProps) {
  return (
    <article className={`${fullPage ? "" : ""}`}>
      {title && <h3 className="mb-3 text-2xl font-bold">{title}</h3>}
      <div
        className={`flex flex-wrap gap-2 ${fullPage ? "grow" : "overflow-hidden"} `}
      >
        {children}
      </div>
    </article>
  );
}

export default SearchResultSection;
