import { Book } from './Book';
import { AppComment } from './AppComment';
import { ImageModel } from './User';

export interface Product {
  productId: number;
  name: string;
  branch: string;
  type: ProductType;
  quantity: number;
  description: string;
  prize: number;
  available: boolean;
  comments?: AppComment[];
  bookins?: Book[];
  images?: ImageModel[];
}

export enum ProductType {
  SKATE_COMPLETO = 'SKATE_COMPLETO',
  PIEZAS = 'PIEZAS',
  MODA = 'MODA',
}
