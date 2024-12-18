import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { baseURL } from '../../api/interseptots';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {

  return (
    <Link
      to={`/category/${category.id}`}
      className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
        <img src={`${baseURL}/uploads/${category.image_url}`} alt={`${category.category_name}`}  className="w-8 h-8 text-blue-600"/>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{category.category_name}</h3>
      {/* <p className="mt-1 text-sm text-gray-500 text-center">
        {category.category_name}
      </p> */}
    </Link>
  );
}