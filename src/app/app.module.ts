import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RegisterComponent } from './components/register/register.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { UserConfigurationComponent } from './components/user-configuration/user-configuration.component';
import { AccordionModule } from 'primeng/accordion';
import { UserBookingsComponent } from './components/user-bookings/user-bookings.component';
import { CalendarModule } from 'primeng/calendar';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { GalleriaModule } from 'primeng/galleria';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainMenuComponent,
    RegisterComponent,
    UserConfigurationComponent,
    UserBookingsComponent,
    ProductsListComponent,
    ProductInfoComponent,
    AdminViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    AccordionModule,
    BrowserAnimationsModule,
    CalendarModule,
    GalleriaModule,
    InputNumberModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
