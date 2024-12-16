import { CategoryCard } from '../components/ui/CategoryCard';
import { categoryDataHierarchy } from '../hooks/categoryHook';

export function HomePage() {
  const {categoriesDataHierarchy} = categoryDataHierarchy()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Все Категории</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesDataHierarchy?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}