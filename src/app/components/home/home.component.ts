import { Component, OnInit } from '@angular/core';
import { ApicallService } from '../../services/apicall.service';
import { ImageModel, Roles, User } from '../../interfaces/User';
import { NgForm } from '@angular/forms';
import { Product, ProductType } from '../../interfaces/product';
import { Book } from '../../interfaces/Book';

import { AppComment } from '../../interfaces/AppComment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  opcion = Opciones.USER;
  opciones = Opciones;
  user!: User;
  users: User[] = [];
  images: ImageModel[] = [];
  prueba!: string;

  constructor(private apiService: ApicallService) {}

  ngOnInit() {
    this.getUsers();
  }

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

  loadProductImages() {
    this.products.forEach((product) => {
      this.apiService.getImages().subscribe((data: ImageModel[]) => {
        product.images = data.filter(
          (image) =>
            image.product && image.product.productId === product.productId
        );
        console.log(product.images);
      });
    });
  }

  //#region Users

  newUser: User = {
    userId: 0,
    username: '',
    email: '',
    password: '',
    bornDate: new Date(),
    rol: Roles.GUEST,
    profileImg: {
      id: 0,
      name: '',
      type: '',
      fotoBase64: '',
    },
    comments: [],
    bookings: [],
  };
  editingUser: boolean = false;
  editedUser: User = {
    userId: 0,
    username: '',
    email: '',
    password: '',
    bornDate: new Date(),
    rol: Roles.GUEST,
    profileImg: {
      id: 0,
      name: '',
      type: '',
      fotoBase64: '',
    },
    comments: [],
    bookings: [],
  };

  onSubmitUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    /*this.apiService.postUser(this.newUser).subscribe(
      (response) => {
        console.log('Usuario añadido exitosamente:', response);
        this.ngOnInit();
        form.resetForm();
      },
      (error) => {
        console.error('Error al añadir usuario:', error);
      }
    );*/
  }

  editUser(user: User) {
    this.editingUser = true;

    this.editedUser = { ...user };
  }

  onEditSubmitUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.apiService.patchUser(this.editedUser).subscribe(
      (response) => {
        console.log('Usuario editado exitosamente:', response);
        this.ngOnInit();
        this.editingUser = false;
      },
      (error) => {
        console.error('Error al editar usuario:', error);
      }
    );
  }

  deleteUser(userId: number) {
    this.apiService.deleteUser(userId).subscribe(
      (response) => {
        console.log('Usuario eliminado exitosamente:', response);
        this.ngOnInit();
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    );
  }

  //#endregion

  //#region Productos

  product!: Product;
  products: Product[] = [];

  newProduct: Product = {
    productId: 0,
    name: '',
    branch: '',
    type: ProductType.MODA,
    comments: [],
    bookins: [],
    images: [],
    description: '',
    prize: 0,
    quantity: 0,
    available: false,
  };

  editingProduct: boolean = false;
  editedProduct: Product = {
    productId: 0,
    name: '',
    branch: '',
    type: ProductType.MODA,
    comments: [],
    bookins: [],
    images: [],
    description: '',
    prize: 0,
    quantity: 0,
    available: false,
  };

  getProducts() {
    this.apiService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      console.log(this.products);
      this.loadProductImages();
    });
  }

  onSubmitProduct(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.apiService.postProduct(this.newProduct).subscribe(
      (response) => {
        console.log('Producto añadido exitosamente:', response);
        this.getProducts();
        form.resetForm();
      },
      (error) => {
        console.error('Error al añadir producto:', error);
      }
    );
  }

  editProduct(product: Product) {
    this.editingProduct = true;
    this.editedProduct = { ...product };
  }

  onEditSubmitProduct(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.apiService.patchProduct(this.editedProduct).subscribe(
      (response) => {
        console.log('Producto editado exitosamente:', response);
        this.getProducts();
        this.editingProduct = false;
      },
      (error) => {
        console.error('Error al editar producto:', error);
      }
    );
  }

  deleteProduct(productId: number) {
    this.apiService.deleteProduct(productId).subscribe(
      (response) => {
        console.log('Producto eliminado exitosamente:', response);
        this.getProducts();
      },
      (error) => {
        console.error('Error al eliminar producto:', error);
      }
    );
  }

  //#endregion

  //#region AppComment
  comment!: AppComment;
  comments: AppComment[] = [];

  newComment: AppComment = {
    commentId: 0,
    comment: '',
    dateCommented: new Date(),
    user: this.user,
    product: this.product,
  };

  editingComment: boolean = false;
  editedComment: AppComment = {
    commentId: 0,
    comment: '',
    dateCommented: new Date(),
    user: this.user,
    product: this.product,
  };

  getComments() {
    this.apiService.getComments().subscribe((data: AppComment[]) => {
      this.comments = data;
    });
  }

  onSubmitComment(form: NgForm) {
    if (form.invalid) {
      return;
    }
    /*this.apiService.postComment(this.newComment).subscribe(
      (response) => {
        console.log('Comentario añadido exitosamente:', response);
        this.getComments();
        form.resetForm();
      },
      (error) => {
        console.error('Error al añadir comentario:', error);
      }
    );*/
  }

  editComment(comment: AppComment) {
    this.editingComment = true;
    this.editedComment = { ...comment };
  }

  onEditSubmitComment(form: NgForm) {
    if (form.invalid) {
      return;
    }
    /* this.apiService.patchComment(this.editedComment).subscribe(
      (response) => {
        console.log('Comentario editado exitosamente:', response);
        this.getComments();
        this.editingComment = false;
      },
      (error) => {
        console.error('Error al editar comentario:', error);
      }
    );*/
  }

  deleteComment(commentId: number) {
    this.apiService.deleteComment(commentId).subscribe(
      (response) => {
        console.log('Comentario eliminado exitosamente:', response);
        this.getComments();
      },
      (error) => {
        console.error('Error al eliminar comentario:', error);
      }
    );
  }
  //#endregion

  //#region Book
  book!: Book;
  books: Book[] = [];

  newBook: Book = {
    bookId: 0,
    reserveDate: new Date(),
    user: this.user,
    product: this.product,
  };

  editingBook: boolean = false;
  editedBook: Book = {
    bookId: 0,
    reserveDate: new Date(),
    user: this.user,
    product: this.product,
  };

  getBooks() {
    this.apiService.getBooks().subscribe((data: Book[]) => {
      this.books = data;
    });
  }

  onSubmitBook(form: NgForm) {
    if (form.invalid) {
      return;
    }
    /* this.apiService.postBook(this.newBook).subscribe(
      (response) => {
        console.log('Libro añadido exitosamente:', response);
        this.getBooks();
        form.resetForm();
      },
      (error) => {
        console.error('Error al añadir libro:', error);
      }
    );*/
  }

  editBook(book: Book) {
    this.editingBook = true;
    this.editedBook = { ...book };
  }

  onEditSubmitBook(form: NgForm) {
    if (form.invalid) {
      return;
    }
    /*this.apiService.patchBook(this.editedBook).subscribe(
      (response) => {
        console.log('Libro editado exitosamente:', response);
        this.getBooks();
        this.editingBook = false;
      },
      (error) => {
        console.error('Error al editar libro:', error);
      }
    );*/
  }

  deleteBook(bookId: number) {
    this.apiService.deleteBook(bookId).subscribe(
      (response) => {
        console.log('Libro eliminado exitosamente:', response);
        this.getBooks();
      },
      (error) => {
        console.error('Error al eliminar libro:', error);
      }
    );
  }
  //#endregion

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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newUser.profileImg = {
          id: 0,
          name: file.name,
          type: file.type,
          fotoBase64: e.target.result,
        };
      };
      reader.readAsDataURL(file);
    }
  }
}
export enum Opciones {
  USER = 'USER',
  PRODUCT = 'PRODUCT',
  BOOK = 'BOOK',
  COMMENT = 'COMMENT',
}
