import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private readonly KEY_LOCAL_STORAGE = 'cart_luvinco';
  private readonly LATEST_VERIFICATION_KEY = 'ultima_verificacao_precos';
  private dailyCheckInterval: any;

  constructor(private readonly http: HttpClient) {
    this.loadCartSalved();
    this.checkChangeDay();
  }

  startDailyCheck() {
    this.dailyCheckInterval = setInterval(() => {
      this.checkChangeDay();
    }, 3600000); // a cada hora
  }

  private loadCartSalved() {
    const cartSalved = localStorage.getItem(this.KEY_LOCAL_STORAGE);
    if (cartSalved) {
      const parsedCart = JSON.parse(cartSalved);
      this.cartItemsSubject.next(parsedCart);

      if (parsedCart.length > 0) {
        this.checkChangeDay();
      }
    }
  }

  private salveCart(cart: CartItem[]) {
    localStorage.setItem(this.KEY_LOCAL_STORAGE, JSON.stringify(cart));
    this.cartItemsSubject.next(cart);
  }

  private isNewDay(dataAnterior: Date, dataAtual: Date): boolean {
    return (
      dataAnterior.getDate() !== dataAtual.getDate() ||
      dataAnterior.getMonth() !== dataAtual.getMonth() ||
      dataAnterior.getFullYear() !== dataAtual.getFullYear()
    );
  }

  checkChangeDay() {
    const agora = new Date();
    const ultimaVerificacaoStr = localStorage.getItem(
      this.LATEST_VERIFICATION_KEY
    );
    const ultimaVerificacao = ultimaVerificacaoStr
      ? new Date(ultimaVerificacaoStr)
      : null;

    if (!ultimaVerificacao || this.isNewDay(ultimaVerificacao, agora)) {
      this.checkUpdates().subscribe({
        next: () => {
          localStorage.setItem(
            this.LATEST_VERIFICATION_KEY,
            agora.toISOString()
          );
        },
        error: (err) => console.error('Erro ao verificar atualizações:', err),
      });
    }
  }

  addToCart(product: Product) {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentItems.push({
        product: { id: product.id, name: product.nome, price: product.preco },
        quantity: 1,
      });
    }

    this.salveCart([...currentItems]);
  }

  removeFromCart(productId: number) {
    const updatedItems = this.cartItemsSubject.value.filter(
      (item) => item.product.id !== productId
    );
    this.salveCart(updatedItems);
  }

  clearCart() {
    this.salveCart([]);
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

  updateQuantity(productId: number, quantity: number) {
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

    this.salveCart(items);
  }

  checkUpdates(): Observable<CartItem[]> {
    return this.cartItemsSubject.pipe(
      switchMap((cart) => {
        if (cart.length === 0) return of(cart);

        const requests = cart.map((item) =>
          this.http.get<any>(
            `${environment.apiUrl}/produtos/${item.product.id}`
          )
        );

        return forkJoin(requests).pipe(
          map((responses) => {
            const updatedCart = cart
              .map((item, index) => ({
                ...item,
                product: {
                  ...item.product,
                  price: responses[index].preco,
                  available: responses[index].disponivel,
                  productData: responses[index],
                },
              }))
              .filter((item) => item.product.available);

            this.salveCart(updatedCart);
            return updatedCart;
          })
        );
      })
    );
  }

  ngOnDestroy() {
    if (this.dailyCheckInterval) {
      clearInterval(this.dailyCheckInterval);
    }
  }
}
