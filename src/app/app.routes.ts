import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    component: CartPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'order-success/:id',
    component: OrderSuccessComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
