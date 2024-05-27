import { Book } from './Book';
import { Product } from './product';

export interface User {
  userId: number;
  username: string;
  email: string;
  password: string;
  bornDate?: Date;
  rol: Roles;
  profileImg?: ImageModel;
  comments?: Comment[];
  bookings?: Book[];
}

export enum Roles {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface ImageModel {
  id: number;
  name: string;
  type: string;
  fotoBase64: string;
  product?: Product;
  user?: User;
}
