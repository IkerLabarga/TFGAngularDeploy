import { Component } from '@angular/core';
import { ImageModel, Roles, User } from '../../interfaces/User';
import { Product, ProductType } from '../../interfaces/product';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApicallService } from '../../services/apicall.service';
import { AppComment } from '../../interfaces/AppComment';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Book } from '../../interfaces/Book';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.scss',
})
export class AdminViewComponent {
  opcion = Opciones.USER;
  opciones = Opciones;
  navBarActive = false;
  loggedInUser: User | null = null;
  ProductType = ProductType;

  newUserId!: number;
  newUserUsername!: string;
  newUserEmail!: string;
  newUserPassword!: string;
  newUserRol!: Roles;
  newBase64String!: string;
  newUserImgId!: number;

  newProductId!: number;
  newProductName!: string;
  newProductBranch!: string;
  newProductType!: ProductType;
  newProductQuantity!: number;
  newProductPrize!: number;
  newProductDescription!: string;
  newProductAvalieable!: boolean;

  newCommentId!: number;
  newCommentComentary!: string;
  newCommentDate!: Date;
  newCommentProductId!: number;
  newCommentUserId!: number;

  newBookId!: number;
  newBookDate!: Date;
  newBookUserId!: number;
  newBookProductId!: number;

  newImageId!: number;
  newImageBase64!: string;
  newImageProductId!: number;

  products: Product[] = [];
  users: User[] = [];
  comments: AppComment[] = [];
  books: Book[] = [];
  images: ImageModel[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApicallService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.getUsers();
    if (this.loggedInUser) {
      this.loadUserImage();
      console.log('Usuario logueado:', this.loggedInUser);
    } else {
      console.log('No hay usuario logueado');
    }
  }

  //#region Users

  getUsers() {
    this.apiService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      this.loadUserImages();
    });
  }

  loadUserImages() {
    this.users.forEach((user) => {
      this.apiService
        .getImageByuserId(user.userId)
        .subscribe((data: ImageModel) => {
          user.profileImg = data;
        });
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.getNewImg(file);
    }
  }

  getNewImg(imageFile: File) {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      if (reader.result) {
        this.newBase64String = reader.result as string;
      }
    };
  }

  deleteUser() {
    this.apiService.deleteUser(this.newUserId).subscribe();
  }

  updateUser() {
    const newUser: User = {
      userId: this.newUserId,
      username: this.newUserUsername,
      email: this.newUserEmail,
      password: this.newUserPassword,
      rol: this.newUserRol,
    };

    const newImg: ImageModel = {
      id: this.newUserImgId,
      name: 'asd',
      type: 'asd',
      fotoBase64: this.newBase64String,
    };

    this.apiService
      .patchUser(newUser)
      .subscribe((respone) => console.log(respone));
  }

  createUser() {
    const newUser: User = {
      userId: 0,
      username: this.newUserUsername,
      email: this.newUserEmail,
      password: this.newUserPassword,
      rol: this.newUserRol,
    };

    const newImg: ImageModel = {
      id: 0,
      name: 'asd',
      type: 'asd',
      fotoBase64: this.newBase64String,
    };

    this.apiService.postUser(newUser, newImg).subscribe();
    window.location.reload();
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

  //#endregion

  //#region Product
  getProducts() {
    this.apiService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.loadProductImages();
    });
  }

  loadProductImages() {
    this.products.forEach((product) => {
      this.apiService.getImages().subscribe((data: ImageModel[]) => {
        product.images = data.filter(
          (image) =>
            image.product && image.product.productId === product.productId
        );
        console.log(product);
      });
    });
  }

  updateProduct() {
    const updateProduct: Product = {
      productId: this.newProductId,
      name: this.newProductName,
      branch: this.newProductBranch,
      type: this.newProductType,
      quantity: this.newProductQuantity,
      description: this.newProductDescription,
      prize: this.newProductPrize,
      available: this.newProductAvalieable,
    };

    this.apiService
      .patchProduct(updateProduct)
      .subscribe((response) =>
        console.log('Usuario actualizado correctamente' + response)
      );
    window.location.reload();
  }

  createProduct() {
    const createProduct: Product = {
      productId: 0,
      name: this.newProductName,
      branch: this.newProductBranch,
      type: this.newProductType,
      quantity: this.newProductQuantity,
      description: this.newProductDescription,
      prize: this.newProductPrize,
      available: this.newProductAvalieable,
    };

    console.log(createProduct);
    this.apiService
      .postProduct(createProduct)
      .subscribe((response) => console.log('Usuario agregado correctamente'));
    window.location.reload();
  }

  deleteProduct() {
    this.apiService
      .deleteProduct(this.newProductId)
      .subscribe((response) =>
        console.log('Usuario borrado correctamente' + response)
      );
    window.location.reload();
  }

  //#endregion

  //#region Comments

  getComments() {
    this.apiService
      .getComments()
      .subscribe((response) => (this.comments = response));
    console.log(this.comments);
  }

  formatDate(timestamp: Date) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  newCommentProduct!: Product;
  newCommentUser!: User;
  createComment() {
    const productObservable = this.apiService.getProductById(
      this.newCommentProductId
    );
    const userObservable = this.apiService.getUserById(this.newCommentUserId);

    forkJoin([productObservable, userObservable]).subscribe(
      ([productResponse, userResponse]) => {
        this.newCommentProduct = productResponse;
        this.newCommentUser = userResponse;

        console.log(this.newCommentProduct);
        console.log(this.newCommentUser);

        const comment: AppComment = {
          commentId: 0,
          comment: this.newCommentComentary,
          dateCommented: this.newCommentDate,
        };

        this.apiService
          .postComment(comment, this.newCommentUser, this.newCommentProduct)
          .subscribe((response) => {
            console.log('SE SUBIO COMENTARIO CORRECTAMENTE' + response);
          });
      }
    );
  }

  updateComment() {
    const productObservable = this.apiService.getProductById(
      this.newCommentProductId
    );
    const userObservable = this.apiService.getUserById(this.newCommentUserId);

    forkJoin([productObservable, userObservable]).subscribe(
      ([productResponse, userResponse]) => {
        this.newCommentProduct = productResponse;
        this.newCommentUser = userResponse;

        const comment: AppComment = {
          commentId: this.newCommentId,
          comment: this.newCommentComentary,
          dateCommented: this.newCommentDate,
        };

        this.apiService
          .patchComment(comment, this.newCommentUser, this.newCommentProduct)
          .subscribe((response) => {
            console.log('SE SUBIO COMENTARIO CORRECTAMENTE' + response);
          });
      }
    );
  }

  deleteComment() {
    this.apiService.deleteComment(this.newCommentId).subscribe();
  }
  //#endregion

  //#region Books

  getBooks() {
    this.apiService.getBooks().subscribe((data: Book[]) => {
      this.books = data;
    });
  }

  updateBook() {
    const productObservable = this.apiService.getProductById(
      this.newBookProductId
    );
    const userObservable = this.apiService.getUserById(this.newBookUserId);

    forkJoin([productObservable, userObservable]).subscribe(
      ([productResponse, userResponse]) => {
        this.newBookProduct = productResponse;
        this.newBookUser = userResponse;

        console.log(this.newBookProduct);
        console.log(this.newBookUser);

        const book: Book = {
          bookId: this.newBookId,
          reserveDate: this.newBookDate,
        };

        this.apiService
          .patchBook(book, this.newBookUser, this.newBookProduct)
          .subscribe((response) => {
            console.log('SE ACTUALIZO LA RESERVA CORRECTAMENTE' + response);
          });
      }
    );
  }

  deleteBook() {
    this.apiService.deleteBook(this.newBookId).subscribe();
  }

  newBookProduct!: Product;
  newBookUser!: User;
  createBook() {
    const productObservable = this.apiService.getProductById(
      this.newBookProductId
    );
    const userObservable = this.apiService.getUserById(this.newBookUserId);

    forkJoin([productObservable, userObservable]).subscribe(
      ([productResponse, userResponse]) => {
        this.newBookProduct = productResponse;
        this.newBookUser = userResponse;

        console.log(this.newBookProduct);
        console.log(this.newBookUser);

        const book: Book = {
          bookId: 0,
          reserveDate: this.newBookDate,
        };

        this.apiService
          .postBook(book, this.newBookUser, this.newBookProduct)
          .subscribe((response) => {
            console.log('SE SUBIO LA RESERVA CORRECTAMENTE' + response);
          });
      }
    );
  }

  //#endregion

  //#region Image

  getImages() {
    this.apiService.getImages().subscribe((data: ImageModel[]) => {
      this.images = data;
    });
    console.log(this.images);
  }

  newImageProduct!: Product;
  newImageUser!: User;
  createImage() {
    const productObservable = this.apiService.getProductById(
      this.newImageProductId
    );

    forkJoin([productObservable]).subscribe(([productResponse]) => {
      this.newImageProduct = productResponse;

      console.log(this.newImageProduct);

      const image: ImageModel = {
        id: 0,
        name: 'asd',
        type: 'image',
        fotoBase64: this.newBase64String,
      };

      this.apiService
        .postImage(image, this.newImageProduct)
        .subscribe((response) => {
          console.log('SE AÑADIO LA IMAGEN CORRECTAMENTE' + response);
        });
    });
  }

  updateImage() {
    const productObservable = this.apiService.getProductById(
      this.newImageProductId
    );

    forkJoin([productObservable]).subscribe(([productResponse]) => {
      this.newImageProduct = productResponse;

      const image: ImageModel = {
        id: this.newImageId,
        name: 'asd',
        type: 'image',
        fotoBase64: this.newBase64String,
      };

      this.apiService
        .postImage(image, this.newImageProduct)
        .subscribe((response) => {
          console.log('SE ACTUALIZO LA IMAGEN CORRECTAMENTE' + response);
        });
    });
  }

  deleteImage() {
    this.apiService.deleteImage(this.newImageId).subscribe();
  }

  //#endregion

  userLogOut() {
    this.authService.logoutUser();
    this.navBarActive = false;
    this.router.navigate(['/']);
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

  navToHome() {
    this.router.navigate(['/']);
  }

  showUserMenu() {
    this.opcion = Opciones.USER;
  }
  showProductMenu() {
    this.opcion = Opciones.PRODUCT;
    this.getProducts();
  }
  showCommentMenu() {
    this.opcion = Opciones.COMMENT;
    this.getComments();
  }
  showBookMenu() {
    this.opcion = Opciones.BOOK;
    this.getBooks();
  }
  showImageMenu() {
    this.opcion = Opciones.IMAGE;
    this.getImages();
  }
}

export enum Opciones {
  USER = 'USER',
  PRODUCT = 'PRODUCT',
  BOOK = 'BOOK',
  COMMENT = 'COMMENT',
  IMAGE = 'IMAGE',
}
