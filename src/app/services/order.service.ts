import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/pedidos`;

  constructor(private http: HttpClient) {}

  createOrder(items: CartItem[]): Observable<any> {
    // Converter os itens do carrinho para o formato esperado pelo backend
    const orderItems = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    return this.http.post(this.apiUrl, { items: orderItems }).pipe(
      tap((response) => console.log('Pedido criado com sucesso', response)),
      catchError((error) => {
        console.error('Erro ao criar pedido', error);
        return of({ error: 'Falha ao criar pedido' });
      })
    );
  }
}
