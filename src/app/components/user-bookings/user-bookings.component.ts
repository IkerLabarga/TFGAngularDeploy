import { Component } from '@angular/core';
import { ImageModel, User } from '../../interfaces/User';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApicallService } from '../../services/apicall.service';
import { Book } from '../../interfaces/Book';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.scss',
})
export class UserBookingsComponent {
  navBarActive = false;
  loggedInUser: User | null = null;
  newDate!: Date;
  bookId!: number;
  book!: Book;
  bookProduct!: Product;
  bookUser: User | null = null;
  formattedReserveDate = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApicallService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.bookUser = this.authService.getLoggedInUser();

    if (this.loggedInUser) {
      this.loadUserImage();
      this.loadUserBooks();

      console.log('Usuario reserva:', this.bookUser);
      console.log('Usuario logueado:', this.loggedInUser);
    } else {
      console.log('No hay usuario logueado');
    }
  }
  getBook() {
    this.apiService.getBookById(this.bookId).subscribe((response) => {
      this.book = response;
    });
    this.formattedReserveDate = this.formatDate(this.book.reserveDate);
  }
  formatDate(timestamp: Date) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
  getProduct() {
    this.apiService.getProductByBookId(this.bookId).subscribe((response) => {
      this.bookProduct = response;
    });
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

  loadUserBooks() {
    if (this.loggedInUser && this.loggedInUser.userId) {
      this.apiService.getBooksByUserId(this.loggedInUser.userId).subscribe(
        (data: Book[]) => {
          if (this.loggedInUser) {
            this.loggedInUser.bookings = data;
            this.loggedInUser?.bookings.forEach(
              (book) => (this.bookId = book.bookId)
            );
            this.loadBookProduct();
          }
        },
        (error) => {
          console.error('Error al cargar la imagen del usuario:', error);
        }
      );
    }
  }

  loadBookProduct() {
    console.log('BOOKID:' + this.bookId);
    this.apiService
      .getProductByBookId(this.bookId)
      .subscribe((response: Product) => {
        if (this.loggedInUser?.bookings) {
          this.loggedInUser?.bookings.forEach((book) => {
            book.product = response;
            this.bookProduct = response;
          });
        }
      });
    this.getBook();
    this.getProduct();
  }

  updateBook() {
    this.book.reserveDate = this.newDate;

    if (this.bookUser && this.loggedInUser?.bookings) {
      this.apiService
        .patchBook(this.book, this.bookUser, this.bookProduct)
        .subscribe(
          (response) => {
            console.error('Se actualizo la reserva correctamente:', response);
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

  navToConfig() {
    this.router.navigate(['/config']);
  }

  navToHome() {
    this.router.navigate(['/']);
  }
}
