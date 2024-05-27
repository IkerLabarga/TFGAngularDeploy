import { Product } from './product';
import { User } from './User';

export interface AppComment {
  commentId: number;
  comment: string;
  dateCommented: Date;
  user?: User;
  product?: Product;
}
