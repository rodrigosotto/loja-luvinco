export interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
}
