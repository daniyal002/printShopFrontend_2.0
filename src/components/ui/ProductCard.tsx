import { useEffect, useState } from 'react';
import { Product } from '../../types';
import { CART_STORAGE_KEY, useCart } from '../../hooks/useCart';
import { formatWhatsAppMessage, getWhatsAppLink } from '../../utils/whatsapp';
import { ShoppingCart, MessageCircleMore, PlusCircle, MinusCircle } from 'lucide-react';
import ProductItemByIdCarusel from '../carousel/CarouselImageAndVideo';
import { message } from 'antd';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart,setCart,cart } = useCart();

  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [cart]);

  const handleAddToCart = () => {
    if (addToCart(product.id as number, quantity)) {
      setQuantity(1);
      message.success(`Вы добавили ${product.product_name} в корзину.`);
    } else {
      message.info('Не удалось добавить товар. Пожалуйста, попробуйте еще раз.');
    }
  };

  const handleBuyNow = () => {
    const message = formatWhatsAppMessage(
      [{ productId: product.id as number, quantity }],
      [product],
    );
    window.open(getWhatsAppLink(message), '_blank');
  };


  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="aspect-square overflow-hidden">
        {(product.image_src || product.video_src) && (
      <ProductItemByIdCarusel images={product?.image_src as string[]} video={product?.video_src as string}/>

        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
          {product.product_name}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          Размер: {product.size}
        </p>
        <p className="mt-2 text-xl font-bold text-gray-900">
          {product.price}₽
        </p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <label htmlFor={`quantity-${product.id}`} className="text-sm text-gray-600">
              Количество:
            </label>
            <button onClick={() => setQuantity(prev => prev < 2 ? prev : prev - 1)}><MinusCircle/></button>
            <input
              id={`quantity-${product.id}`}
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-2 py-1 border rounded-md"
            />
            <button onClick={() => setQuantity(prev => prev + 1)}
             ><PlusCircle /></button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              В корзину
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              <MessageCircleMore className="w-4 h-4 mr-2" />
              Купить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}