import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem } from '../../models/cart-item.model';
import { Observable, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [MatButtonModule, MatBadgeModule, MatIconModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent implements OnInit {
  carrinho$: Observable<CartItem[]> | undefined;

  constructor(
    public readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.carrinho$ = this.cartService.checkUpdates();
  }

  viewCart() {
    this.router.navigate(['/carrinho']);
  }

  updateCart() {
    this.cartService.checkUpdates().subscribe({
      next: () =>
        this.snackBar.open('Carrinho atualizado com sucesso!', 'Fechar', {
          duration: 3000,
        }),
      error: (err) =>
        this.snackBar.open(`Erro ao atualizar: ${err.message}`, 'Fechar', {
          duration: 5000,
        }),
    });
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
}
