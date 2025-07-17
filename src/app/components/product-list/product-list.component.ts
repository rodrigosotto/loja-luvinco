import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductItemComponent } from '../product-item/product-item.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductItemComponent,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  marcas: string[] = [];
  searchTerm = '';
  selectedMarca = '';
  lastUpdated: Date | null = null;
  isLoading = false;
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(forceRefresh = false): void {
    this.isLoading = true;

    (forceRefresh
      ? this.productService.forceRefresh()
      : this.productService.getProducts()
    ).subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.marcas = [...new Set(products.map((p) => p.marca))];
        this.lastUpdated = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        //adicionar um alert para informar o usuario que ocorreu um problema ao carregar produtos
        console.error('Erro ao carregar produtos', error);
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch = product.nome
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesmarca = this.selectedMarca
        ? product.marca === this.selectedMarca
        : true;
      return matchesSearch && matchesmarca;
    });
  }
}
