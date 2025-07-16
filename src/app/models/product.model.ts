export interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category: string;
  imageUrl?: string;
  available: boolean;
}
