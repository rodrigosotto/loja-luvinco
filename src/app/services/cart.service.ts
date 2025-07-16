import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(product: Product): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentItems.push({ product, quantity: 1 });
    }

    this.cartItemsSubject.next([...currentItems]);
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.cartItemsSubject.value.filter(
      (item) => item.product.id !== productId
    );
    this.cartItemsSubject.next(updatedItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getCartItems(): CartItem[] {
    return [...this.cartItemsSubject.value];
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.cartItemsSubject.value.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.cartItemsSubject.next(items);
  }
}
