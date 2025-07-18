import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { LogoutComponent } from './components/logout/logout.component';

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
  { path: 'logout', component: LogoutComponent },
  {
    path: 'produtos',
    component: ProductListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'carrinho',
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
