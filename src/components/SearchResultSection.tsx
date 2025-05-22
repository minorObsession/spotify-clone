import { ReactNode } from "react";

interface SearchResultSectionProps {
  title?: string;
  children: ReactNode;
}

function SearchResultSection({ title, children }: SearchResultSectionProps) {
  return (
    <article>
      {title && <h3 className="mb-3 text-2xl font-bold">{title}</h3>}
      <div className="flex gap-2 overflow-hidden">{children}</div>
    </article>
  );
}

export default SearchResultSection;
