import { CART_STORAGE_KEY, useCart } from "../../hooks/useCart";
import { X, Trash2, MessageCircleMore, PlusCircle, MinusCircle } from "lucide-react";
import { formatWhatsAppMessage, getWhatsAppLink } from "../../utils/whatsapp";
import { productData } from "../../hooks/productHook";
import { CartItem, Product } from "../../types";
import { useEffect } from "react";
import { baseURL } from "../../api/interseptots";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal, setCart } =
    useCart();
  const { productsData: products } = productData();

  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isOpen, cart]);


  const handleCheckout = () => {
    const message = formatWhatsAppMessage(
      cart?.items as CartItem[],
      products as Product[]
    );
    window.open(getWhatsAppLink(message), "_blank");
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-6 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Корзина</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              {cart?.items.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                <div className="space-y-6">
                  {cart?.items.map((item) => {
                    const product = products?.find(
                      (p) => p.id === item.productId
                    );
                    if (!product) return null;

                    return (
                      <div key={item.productId} className="flex space-x-4">
                        {product.image_src && (
                          <img
                            src={`${baseURL}/uploads/${product?.image_src[0]}`}
                            alt={product.product_name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">
                            {product.product_name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.price}₽
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                          <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1,)}
                            >
                              <MinusCircle />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.productId,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 px-2 py-1 border rounded-md"
                            />
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1,)}
                            >
                              <PlusCircle />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {(product.price * item.quantity).toFixed(2)}₽
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart?.items && cart?.items?.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Итого</p>
                  <p>{getCartTotal().toFixed(2)}₽</p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <MessageCircleMore className="w-4 h-4 mr-2" />
                  Купить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
