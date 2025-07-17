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
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Verifica atualizações ao inicializar
    this.carrinho$ = this.cartService.checkUpdates();
  }

  viewCart() {
    this.router.navigate(['/cart']);
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
        take(1), // pega só o valor atual
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
