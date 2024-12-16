import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href: string;
  }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
            <Link
              to={item.href}
              className={`text-sm ${
                index === items.length - 1
                  ? 'text-gray-700 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}