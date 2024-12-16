import { Category, Subcategory, Product } from '../types';

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Laptop',
    description: 'Latest gadgets and electronic devices'
  },
  {
    id: 'mobile',
    name: 'Mobile Devices',
    icon: 'Smartphone',
    description: 'Smartphones and tablets'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: 'Headphones',
    description: 'Headphones and speakers'
  },
  {
    id: 'wearables',
    name: 'Wearables',
    icon: 'Watch',
    description: 'Smart watches and fitness trackers'
  },
  {
    id: 'cameras',
    name: 'Cameras',
    icon: 'Camera',
    description: 'Digital cameras and accessories'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: 'Gamepad',
    description: 'Gaming consoles and accessories'
  },
];

export const subcategories: Subcategory[] = [
  {
    id: 'laptops',
    categoryId: 'electronics',
    name: 'Laptops',
    description: 'Powerful laptops for work and play'
  },
];

export const products: Product[] = [
  {
    id: 'laptop-1',
    name: 'Ultra Pro Laptop X1',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    categoryId: 'electronics',
    subcategoryId: 'laptops',
    description: 'Powerful laptop for professionals',
    stock: 10
  },
  {
    id: 'laptop-2',
    name: 'MacBook Pro M2',
    price: 1999.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    categoryId: 'electronics',
    subcategoryId: 'laptops',
    description: 'Apples latest professional laptop',
    stock: 5
  },
];