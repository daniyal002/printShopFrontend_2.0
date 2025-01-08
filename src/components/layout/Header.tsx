import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Phone } from 'lucide-react';
import CartButton from '../ui/CartButton';
import { tel } from '../../api/interseptots';
import whatsapp from './whatsapp.svg'

const WHATSAPP_LINK = `https://wa.me/${tel.replace(/\D/g, '')}`

export function Header() {
  const location = useLocation()

  if (location.pathname.startsWith('/admin/') || location.pathname === '/admin') {
    return null;
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ММаркет</span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <a
              href={`tel:${tel}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <Phone className="w-5 h-5 text-blue-600" />
              <span className="hidden sm:block">+{tel}</span>
            </a>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
            >
              <img src={whatsapp} alt="WhatsApp" className="w-9 h-9" />
              <span className="hidden sm:block">WhatsApp</span>
            </a>

            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}