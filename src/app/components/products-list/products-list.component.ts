import { Component } from '@angular/core';
import { ImageModel, User } from '../../interfaces/User';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApicallService } from '../../services/apicall.service';
import { Product, ProductType } from '../../interfaces/product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  navBarActive = false;
  loggedInUser: User | null = null;
  products: Product[] = [];
  filterText = '';
  filteredProducts: Product[] = [];
  type!: ProductType;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApicallService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const type = params.get('type') as ProductType;
      this.type == type;
      this.getProducts(type);
    });

    this.loggedInUser = this.authService.getLoggedInUser();
    if (this.loggedInUser) {
      this.loadUserImage();
      console.log('Usuario logueado:', this.loggedInUser);
    } else {
      console.log('No hay usuario logueado');
    }
  }

  getProducts(type: ProductType) {
    this.apiService.getProducts().subscribe((response) => {
      this.products = response;
      this.products.shift();
      if (type) {
        this.filteredProducts = this.products.filter(
          (product) => product.type === type
        );
      } else {
        this.filteredProducts = this.products;
      }
      this.getProductsImages();
    });
  }

  getProductsImages() {
    this.products.forEach((product) => {
      this.apiService
        .getImagesByProductId(product.productId)
        .subscribe((response) => (product.images = response));
    });
    console.log(this.products);
  }

  getFilteredInputProducts(type: ProductType) {
    if (this.filterText != '') {
      this.products = this.products.filter((product) =>
        product.name
          .toLowerCase()
          .includes(this.filterText.trim().toLowerCase())
      );
    } else {
      this.getProducts(type);
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

  navToProductInfo(productId: number) {
    this.router.navigate(['/productinfo/' + productId]);
  }

  navToLogIn() {
    this.router.navigate(['/login']);
  }

  navToHome() {
    this.router.navigate(['/']);
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
}
