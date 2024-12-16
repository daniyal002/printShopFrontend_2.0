import { useState, useEffect } from 'react';
import { CartState } from '../types';
import {  productData } from './productHook';
// import { products } from '../data/categories';

export const CART_STORAGE_KEY = 'shopping-cart';

export function useCart() {
  const [cart, setCart] = useState<CartState>(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  });

  const {productsData: products} = productData()

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

   // Синхронизация с localStorage при изменении извне
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

  const addToCart = (productId: number, quantity: number) => {
    const product = products?.find(p => p.id === productId);
    if (!product || quantity <= 0) return false;

    setCart(currentCart => {
      const existingItem = currentCart.items.find(item => item.productId === productId);
      const updatedCart = existingItem
        ? {
            items: currentCart.items.map(item =>
              item.productId === productId
                ? { ...item, quantity: existingItem.quantity + quantity }
                : item
            ),
          }
        : {
            items: [...currentCart.items, { productId, quantity }],
          };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY, newValue: JSON.stringify(updatedCart) }));
      return updatedCart;
    });

    return true;
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const product = products?.find(p => p.id === productId);
    if (!product || quantity <= 0) return false;

    setCart(currentCart => {
      const updatedCart = {
        items: currentCart.items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        ),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY, newValue: JSON.stringify(updatedCart) }));
      return updatedCart;
    });

    return true;
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart => {
      const updatedCart = {
        items: currentCart.items.filter(item => item.productId !== productId),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY, newValue: JSON.stringify(updatedCart) }));
      return updatedCart;
    });
  };

  const clearCart = () => {
    const updatedCart = { items: [] };

    setCart(updatedCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new StorageEvent('storage', { key: CART_STORAGE_KEY, newValue: JSON.stringify(updatedCart) }));
  };


  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      const product = products?.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    setCart,
  };
}