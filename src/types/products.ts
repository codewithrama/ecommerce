export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  description: string;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}
