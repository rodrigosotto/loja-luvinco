import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';

export const routes: Routes = [
  //criar rota para carrinho de compra
  { path: '', component: ProductListComponent, pathMatch: 'full' },
  { path: 'cart', component: CartPageComponent },
  { path: '**', redirectTo: '' },
  { path: 'order-success/:id', component: OrderSuccessComponent },
];
