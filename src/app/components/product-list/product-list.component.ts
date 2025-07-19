import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductItemComponent } from '../product-item/product-item.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  catchError,
  delayWhen,
  of,
  retryWhen,
  take,
  timeout,
  timer,
} from 'rxjs';

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
  categorias: string[] = [];
  searchTerm = '';
  selectedMarca = '';
  selectedCategoria = '';
  lastUpdated: Date | null = null;
  isLoading = false;
  constructor(
    private readonly productService: ProductService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(forceRefresh = false) {
    this.isLoading = true;
    this.products = [];
    this.filteredProducts = [];
    this.marcas = [];
    this.categorias = [];

    const source$ = forceRefresh
      ? this.productService.forceRefresh()
      : this.productService.getProducts();

    source$
      .pipe(
        timeout(5000),
        retryWhen((errors) =>
          errors.pipe(
            delayWhen(() => timer(1000)),
            take(3)
          )
        ),
        catchError((err) => {
          this.isLoading = false;
          this.snackBar.open(
            'Produtos não foram carregados. Tente novamente mais tarde.',
            'Fechar',
            {
              duration: 6000,
            }
          );
          return of(null);
        })
      )
      .subscribe((products) => {
        this.isLoading = false;

        if (!products) return;

        this.products = products;
        this.filteredProducts = products;
        this.marcas = [...new Set(products.map((p) => p.marca))];
        this.categorias = [...new Set(products.map((p) => p.categoria))];
        this.lastUpdated = new Date();
      });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch = product.nome
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesMarca = this.selectedMarca
        ? product.marca === this.selectedMarca
        : true;
      const matchesCategoria = this.selectedCategoria
        ? product.categoria === this.selectedCategoria
        : true;
      return matchesSearch && matchesMarca && matchesCategoria;
    });
  }
}
