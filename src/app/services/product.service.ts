import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/produtos`;
  private cacheKey = 'product_cache';
  private cacheExpiryHours = 24;

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    const cachedData = this.getCachedProducts();

    if (cachedData) {
      return of(cachedData);
    }

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

    const hoursDiff = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < this.cacheExpiryHours) {
      return cached.products;
    }

    return null;
  }

  private cacheProducts(products: Product[]) {
    const cacheData = {
      timestamp: new Date().toISOString(),
      products: products,
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
  }

  forceRefresh(): Observable<Product[]> {
    localStorage.removeItem(this.cacheKey);
    return this.getProducts();
  }
}
