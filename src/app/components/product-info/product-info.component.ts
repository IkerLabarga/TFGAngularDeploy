import { Component } from '@angular/core';
import { ImageModel, User } from '../../interfaces/User';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApicallService } from '../../services/apicall.service';
import { Product, ProductType } from '../../interfaces/product';
import { AppComment } from '../../interfaces/AppComment';
import { Book } from '../../interfaces/Book';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss',
})
export class ProductInfoComponent {
  navBarActive = false;
  loggedInUser: User | null = null;
  productId: number | null = null;
  product: Product | null = null;
  commentInput!: string;
  comments!: AppComment[];
  commentId!: number;
  userComment!: User;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApicallService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id !== null) {
        this.productId = +id;
        this.getProductById(this.productId);
        this.getComments(this.productId);

        console.log('Product ID:', this.productId);
      } else {
        console.error('Product ID is null');
      }
    });
    this.loggedInUser = this.authService.getLoggedInUser();
    if (this.loggedInUser) {
      this.loadUserImage();
      console.log('Usuario logueado:', this.loggedInUser);
    } else {
      console.log('No hay usuario logueado');
    }
  }
  getProductById(id: number) {
    this.apiService.getProductById(id).subscribe((response) => {
      this.product = response;

      this.getProductImage(id);
    });
  }

  getProductImage(id: number) {
    this.apiService.getImagesByProductId(id).subscribe((response) => {
      if (this.product) {
        this.product.images = response;
      }
    });
  }
  postComment() {
    const comment: AppComment = {
      commentId: 0,
      comment: this.commentInput,
      dateCommented: new Date(),
    };

    if (this.product && this.loggedInUser && this.productId) {
      const productBook: Product = {
        productId: this.productId,
        name: this.product.name,
        branch: this.product.branch,
        type: this.product.type,
        description: this.product.description,
        prize: this.product.prize,
        quantity: this.product.quantity,
        available: this.product.available,
      };

      const userBook: User = {
        userId: this.loggedInUser.userId,
        username: this.loggedInUser.username,
        email: this.loggedInUser.email,
        password: this.loggedInUser.password,
        bornDate: this.loggedInUser.bornDate,
        rol: this.loggedInUser.rol,
      };
      console.log(comment);
      console.log(productBook);
      console.log(userBook);
      this.apiService
        .postComment(comment, userBook, productBook)
        .subscribe((response) => console.log('Reserva post' + response));
    }
  }

  postBook() {
    const book: Book = {
      bookId: 0,
      reserveDate: new Date(),
    };

    if (this.product && this.loggedInUser && this.productId) {
      // Hacemos una copia del producto y eliminamos propiedades no necesarias            this.product
      const productBook: Product = {
        productId: this.productId,
        name: this.product.name,
        branch: this.product.branch,
        type: this.product.type,
        description: this.product.description,
        prize: this.product.prize,
        quantity: this.product.quantity,
        available: this.product.available,
      };

      // Hacemos una copia del usuario y eliminamos propiedades no necesarias
      const userBook: User = {
        userId: this.loggedInUser.userId,
        username: this.loggedInUser.username,
        email: this.loggedInUser.email,
        password: this.loggedInUser.password,
        bornDate: this.loggedInUser.bornDate,
        rol: this.loggedInUser.rol,
      };
      console.log(book);
      console.log(productBook);
      console.log(userBook);
      this.apiService
        .postBook(book, userBook, productBook)
        .subscribe((response) => console.log('Reserva post' + response));
    }
  }

  getComments(id: number) {
    this.apiService
      .getCommentByProductId(id)
      .subscribe((result: AppComment[]) => {
        if (this.product) {
          this.product.comments = result;
          console.log(this.product);
          result.forEach((comment) => {
            this.getUserCommentById(comment.commentId);
          });
        }
      });
  }

  getUserCommentById(commentId: number) {
    this.apiService.getUserComment(commentId).subscribe((user: User) => {
      if (this.product && this.product.comments) {
        const commentIndex = this.product.comments.findIndex(
          (comment) => comment.commentId === commentId
        );
        if (commentIndex !== -1) {
          this.product.comments[commentIndex].user = user;
        }
      }
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

  formatDate(timestamp: Date) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
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

  navToProductList() {
    const a = this.product?.type;
    this.router.navigate(['/product/' + a]);
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
