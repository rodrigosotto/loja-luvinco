import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent {
  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  viewCart(): void {
    this.router.navigate(['/cart']);
  }

  checkout(): void {
    this.cartService.cartItems$.subscribe({
      next: (cartItems) => {
        this.orderService.createOrder(cartItems).subscribe({
          next: (order) => {
            alert(`Pedido #${order.id} realizado com sucesso!`);
            this.cartService.clearCart();
            this.router.navigate(['/order-success', order.id]);
          },
          error: (error) => alert('Erro ao finalizar pedido: ' + error.message),
        });
      },
      error: (error) =>
        alert('Erro ao obter itens do carrinho: ' + error.message),
    });
  }
}
