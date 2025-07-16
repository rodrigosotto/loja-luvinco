import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [MatButtonModule, MatBadgeModule, MatIconModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent {
  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  viewCart() {
    console.log('carrinho');
    this.router.navigate(['/cart']);
  }

  checkout() {
    this.cartService.cartItems$.subscribe((items) => {
      this.orderService.createOrder(items).subscribe({
        next: (order) => {
          this.snackBar.open(
            `Pedido #${order.id} realizado com sucesso!`,
            'Fechar',
            {
              duration: 5000,
              panelClass: ['success-snackbar'],
            }
          );
          this.cartService.clearCart();
          this.router.navigate(['/order-success', order.id]);
        },
        error: (error) => {
          this.snackBar.open(
            `Erro ao finalizar pedido: ${error.message}`,
            'Fechar',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
    });
  }
}
