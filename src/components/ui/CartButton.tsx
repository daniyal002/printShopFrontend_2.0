import { ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useState } from "react";
import { CartDrawer } from "../cart/CartDrawer";
import { useLocation } from "react-router-dom";

export default function CartButton() {
  const { cart } = useCart();
  const cartItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const location  = useLocation()

  if (location.pathname.startsWith('/admin/') || location.pathname === '/admin') {
    return null; // Возвращаем null, если путь соответствует
  }
  return (
    <>
    <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-400 hover:text-gray-500 "
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>

  )
}
