import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import CartButton from '../ui/CartButton';

export function Header() {

  const location  = useLocation()

  if (location.pathname.startsWith('/admin/') || location.pathname === '/admin') {
    return null; // Возвращаем null, если путь соответствует
  }

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ММаркет</span>
            </Link>
            <CartButton/>
          </div>
        </div>
      </header>
    </>
  );
}