import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../interfaces/product';
import { Book } from '../interfaces/Book';
import { AppComment } from '../interfaces/AppComment';
import { ImageModel, User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class ApicallService {
  private url = 'https://skateshopapi.azurewebsites.net/api/v1/'; //http://localhost:8080/api/v1/

  constructor(private http: HttpClient) {}

  //#region Users

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 'user/');
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.url + 'user/' + id);
  }

  postUser(user: User, image: ImageModel): Observable<User> {
    const userData = {
      user: user,
      image: image,
    };

    return this.http.post<User>(this.url + 'user/', userData);
  }

  patchUser(user: User): Observable<User> {
    return this.http.patch<User>(this.url + `user/`, user);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(this.url + 'user/' + id);
  }

  //#endregion

  //#region Product

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url + 'product/');
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(this.url + 'product/' + id);
  }

  postProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url + 'product/', product);
  }

  patchProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(this.url + 'product/', product);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(this.url + 'product/' + id);
  }

  //#endregion

  //#region AppComment

  getComments(): Observable<AppComment[]> {
    return this.http.get<AppComment[]>(this.url + 'comment/');
  }

  getCommentById(id: number): Observable<AppComment> {
    return this.http.get<AppComment>(this.url + 'comment/' + id);
  }

  postComment(
    comment: AppComment,
    user: User,
    product: Product
  ): Observable<AppComment> {
    const postComment = {
      user: user,
      product: product,
      comment: comment,
    };
    return this.http.post<AppComment>(this.url + 'comment/', postComment);
  }

  patchComment(
    comment: AppComment,
    user: User,
    product: Product
  ): Observable<AppComment> {
    const patchComment = {
      user: user,
      product: product,
      comment: comment,
    };
    return this.http.put<AppComment>(this.url + 'comment/', patchComment);
  }

  getCommentByProductId(idProduct: number): Observable<AppComment[]> {
    return this.http.get<AppComment[]>(
      this.url + 'comment/product/' + idProduct
    );
  }

  getUserComment(id: number): Observable<User> {
    return this.http.get<User>(this.url + 'comment/user/' + id);
  }

  deleteComment(id: number): Observable<AppComment> {
    return this.http.delete<AppComment>(this.url + 'comment/' + id);
  }

  //#endregion

  //#region Book

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.url + 'book/');
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(this.url + 'book/' + id);
  }

  getBooksByUserId(id: number): Observable<Book[]> {
    return this.http.get<Book[]>(this.url + 'book/user/' + id);
  }

  getProductByBookId(id: number): Observable<Product> {
    return this.http.get<Product>(this.url + 'book/product/' + id);
  }

  postBook(book: Book, user: User, product: Product): Observable<Book> {
    const postBook = {
      booking: book,
      product: product,
      user: user,
    };
    return this.http.post<Book>(this.url + 'book/', postBook);
  }

  patchBook(book: Book, user: User, product: Product): Observable<Book> {
    const patchBook = {
      user: user,
      product: product,
      booking: book,
    };
    return this.http.put<Book>(this.url + 'book/', patchBook);
  }

  deleteBook(id: number): Observable<Book> {
    return this.http.delete<Book>(this.url + 'book/' + id);
  }

  //#endregion

  //#region ImageModel

  getImages(): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(this.url + 'photo/');
  }

  getImageById(id: number): Observable<ImageModel> {
    return this.http.get<ImageModel>(this.url + 'photo/' + id);
  }

  getImageByuserId(idUser: number): Observable<ImageModel> {
    return this.http.get<ImageModel>(this.url + 'photo/user/' + idUser);
  }

  getImagesByProductId(id: number): Observable<ImageModel[]> {
    return this.http.get<ImageModel[]>(this.url + 'photo/product/' + id);
  }

  postImage(image: ImageModel, product: Product): Observable<ImageModel> {
    const postImage = {
      image: image,
      product: product,
    };
    return this.http.post<ImageModel>(this.url + 'photo/', postImage);
  }

  patchImage(image: ImageModel): Observable<ImageModel> {
    return this.http.patch<ImageModel>(this.url + 'photo/', image);
  }

  deleteImage(id: number): Observable<ImageModel> {
    return this.http.delete<ImageModel>(this.url + 'photo/' + id);
  }

  //#endregion
}
