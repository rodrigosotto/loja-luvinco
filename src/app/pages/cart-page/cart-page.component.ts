import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
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
      this.router.navigate(['/']);
  }
  goToHome() {
    this.router.navigate(['/']);
  }
}
