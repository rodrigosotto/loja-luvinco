import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-item',
  imports: [DecimalPipe],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}
