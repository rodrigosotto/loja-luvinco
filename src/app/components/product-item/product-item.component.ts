import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CurrencyPipe, MatIconModule],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {
  @Input() product!: Product;
  placeholderImage = 'assets/images/placeholder.png';

  constructor(private readonly cartService: CartService) {}

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }

  getSafeImage(imageUrl: string | undefined | null): string {
    return imageUrl?.trim() ? imageUrl : this.placeholderImage;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.placeholderImage;
    imgElement.onerror = null;
  }
}
