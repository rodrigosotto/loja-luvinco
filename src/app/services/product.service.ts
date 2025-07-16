import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/produtos`;

  constructor(private http: HttpClient) {}

  getProducts(filters?: {
    category?: string;
    brand?: string;
  }): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, { params: filters });
  }
}
