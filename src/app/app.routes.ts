import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  //criar rota para carrinho de compra
  {
    path: '',
    component: ProductListComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  { path: 'cart', component: CartPageComponent, canActivate: [authGuard] },
  { path: 'order-success/:id', component: OrderSuccessComponent },
  {
    path: 'login',
    component: LoginComponent,
  },
];
