import { CartItem } from './cart-item.model';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}
