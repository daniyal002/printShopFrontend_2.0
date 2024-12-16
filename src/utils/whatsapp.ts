import { tel } from '../api/interseptots';
import { CartItem, Product } from '../types';

export function formatWhatsAppMessage(
  items: CartItem[],
  products: Product[],
): string {
  const itemsList = items
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return '';
      return `• ${product.product_name} x${item.quantity} - ${(product.price * item.quantity).toFixed(2)}₽`;
    })
    .join('\n');

  const total = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const message = `Новый заказ \n\n${itemsList}\n\nИтого: ${total.toFixed(2)}₽`;
  return encodeURIComponent(message);
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${tel}?text=${message}`;
}