import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ImageModel, User } from '../../interfaces/User';
import { AuthService } from '../../services/auth.service';
import { ApicallService } from '../../services/apicall.service';
import { ProductType } from '../../interfaces/product';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {
  navBarActive = false;
  loggedInUser: User | null = null;
  ProductType = ProductType;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApicallService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    if (this.loggedInUser) {
      this.loadUserImage();
      console.log('Usuario logueado:', this.loggedInUser);
    } else {
      console.log('No hay usuario logueado');
    }
  }

  loadUserImage() {
    if (this.loggedInUser && this.loggedInUser.userId) {
      this.apiService.getImageByuserId(this.loggedInUser.userId).subscribe(
        (data: ImageModel) => {
          if (this.loggedInUser) {
            this.loggedInUser.profileImg = data;
          }
        },
        (error) => {
          console.error('Error al cargar la imagen del usuario:', error);
        }
      );
    }
  }

  userLogOut() {
    this.authService.logoutUser();
    this.navBarActive = false;
    window.location.reload();
  }

  openSidebar() {
    this.navBarActive = true;
  }

  closeSidebar() {
    this.navBarActive = false;
  }

  navToLogIn() {
    this.router.navigate(['/login']);
  }

  navToRegister() {
    this.router.navigate(['/register']);
  }

  navToConfig() {
    this.router.navigate(['/config']);
  }

  navToBooks() {
    this.router.navigate(['/books']);
  }

  navToProductList(a: ProductType) {
    this.router.navigate(['/product/' + a]);
  }

  navToAdminView() {
    this.router.navigate(['/adminview/']);
  }
}
