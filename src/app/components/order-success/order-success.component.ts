// src/app/components/order-success/order-success.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss'],
})
export class OrderSuccessComponent implements OnInit {
  orderId: string = '';
  orderDetails: Order | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';

    if (this.orderId) {
      this.orderService.getOrderDetails(this.orderId).subscribe({
        next: (order) => {
          this.orderDetails = order;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar pedido:', error);
          this.isLoading = false;
        },
      });
    } else {
      this.isLoading = false;
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  }
  getOrderTotal(): number {
    if (!this.orderDetails) return 0;
    return this.orderDetails.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
}
