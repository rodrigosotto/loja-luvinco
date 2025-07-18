import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private readonly http: HttpClient) {}

  createOrder(cartItems: CartItem[]) {
    const payload: OrderItem[] = cartItems.map((i) => ({
      id: i.product.id,
      quantity: i.quantity,
    }));

    return this.http.post(`${environment.apiUrl}/pedidos`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  getOrderDetails(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`).pipe(
      catchError((error) => {
        console.error('Error fetching order details:', error);
        throw error;
      })
    );
  }
}
