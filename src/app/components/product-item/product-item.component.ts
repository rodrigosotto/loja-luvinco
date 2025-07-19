import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {
  @Input() product!: Product;
  placeholderImage = 'assets/images/placeholder.png';
  isImageLoading = true;

  constructor(
    private readonly cartService: CartService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  getSafeImage(url: string | null | undefined): string {
    return url ? `/api/images/${url}` : this.placeholderImage;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.placeholderImage;
    imgElement.onerror = null;
    this.isImageLoading = false;
  }

  handleImageLoad() {
    setTimeout(() => {
      this.isImageLoading = false;
      this.cdr.detectChanges();
    });
  }
}
