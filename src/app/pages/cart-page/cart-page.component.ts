import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, take } from 'rxjs';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent {
  displayedColumns: string[] = [
    'product',
    'price',
    'quantity',
    'total',
    'actions',
  ];

  constructor(
    public readonly cartService: CartService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly orderService: OrderService
  ) {}

  getTotal(): number {
    return this.cartService
      .getCartItems()
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  proceedToCheckout() {
    this.snackBar.open(
      'Para este desafio, não foi solicitado página do CHECKOUT',
      'Fechar',
      {
        duration: 5000,
      }
    ),
      setTimeout(() => {
        this.checkout();
      }, 5000);
  }

  checkout() {
    this.cartService.cartItems$
      .pipe(
        take(1),
        switchMap((items) => this.orderService.createOrder(items))
      )
      .subscribe(
        (order: any) => {
          this.snackBar.open(
            `Pedido #${order.id} realizado com sucesso!`,
            'Fechar',
            { duration: 5000, panelClass: ['success-snackbar'] }
          );
          this.cartService.clearCart();
          this.router.navigate(['/order-success', order.id]);
        },
        (err: any) => {
          this.snackBar.open(
            `Erro ao finalizar pedido: ${err.message}`,
            'Fechar',
            { duration: 5000, panelClass: ['error-snackbar'] }
          );
        }
      );
  }
  goToHome() {
    this.router.navigate(['/']);
  }
}
