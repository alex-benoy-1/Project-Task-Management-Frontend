import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({
  items,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-gray-500 transition-colors hover:text-blue-600"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-medium text-gray-900"
                    : "text-gray-500"
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <span className="text-gray-400">
                &gt;
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}