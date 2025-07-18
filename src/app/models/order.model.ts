export interface Order {
  id: string;
  items: {
    product: {
      id: number;
      name: string;
      price: number;
      imageUrl?: string;
    };
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  customerName?: string;
  shippingAddress?: string;
}
