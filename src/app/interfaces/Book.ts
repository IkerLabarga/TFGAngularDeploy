import { Product } from './product';
import { User } from './User';

export interface Book {
  bookId: number;
  reserveDate: Date;
  user?: User;
  product?: Product;
}
