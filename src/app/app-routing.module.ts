import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserConfigurationComponent } from './components/user-configuration/user-configuration.component';
import { UserBookingsComponent } from './components/user-bookings/user-bookings.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'config', component: UserConfigurationComponent },
  { path: 'books', component: UserBookingsComponent },
  { path: 'product', component: ProductsListComponent },
  { path: 'product/:type', component: ProductsListComponent },
  { path: 'productinfo/:id', component: ProductInfoComponent },
  { path: 'adminview', component: AdminViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
