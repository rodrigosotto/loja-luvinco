// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/produtos`;
  private cacheKey = 'product_cache';
  private cacheExpiryHours = 24; // Atualiza uma vez por dia

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    const cachedData = this.getCachedProducts();

    // Se tem cache válido, retorna do cache
    if (cachedData) {
      return of(cachedData);
    }

    // Se não, faz requisição e armazena no cache
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => {
        this.cacheProducts(products);
      })
    );
  }

  private getCachedProducts(): Product[] | null {
    const cachedStr = localStorage.getItem(this.cacheKey);
    if (!cachedStr) return null;

    const cached = JSON.parse(cachedStr);
    const now = new Date();
    const cacheTime = new Date(cached.timestamp);

    // Verifica se o cache ainda é válido (menos de 24h)
    const hoursDiff = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < this.cacheExpiryHours) {
      return cached.products;
    }

    return null;
  }

  private cacheProducts(products: Product[]): void {
    const cacheData = {
      timestamp: new Date().toISOString(),
      products: products,
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
  }

  // Força atualização ignorando o cache
  forceRefresh(): Observable<Product[]> {
    localStorage.removeItem(this.cacheKey);
    return this.getProducts();
  }
}
