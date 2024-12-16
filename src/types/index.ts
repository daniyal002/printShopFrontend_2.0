export interface Category {
  id: number;
  category_name: string;
  parent_id?: number;
  image_url: string;
  subcategories?: ICategoryChild[];
}

export interface ICategoryChild {
  id?: number;
  category_name: string;
  parent_id?: number;
  image_url?: string; // для хранения URL изображения
}


export interface Product {
  id?: number;
  product_name: string;
  price: number;
  category_id: number;
  size: string;
  image_src?: string[];
  video_src?: string;
  category?: ICategoryChild;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}


export interface ExtendedFile extends File {
  uid: string;
}