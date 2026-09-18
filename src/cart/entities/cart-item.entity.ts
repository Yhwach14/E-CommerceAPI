import * as typeorm from 'typeorm';
import { Product } from '../../products/entities/product.entity.js';
import { User } from '../../users/entities/user.entity.js';

@typeorm.Entity()
@typeorm.Unique(['user', 'product'])
export class CartItem {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

  @typeorm.ManyToOne(() => User, (user) => user.cartItems)
  @typeorm.JoinColumn({ name: 'userId' })
  user: typeorm.Relation<User>;

  @typeorm.ManyToOne(() => Product, (product) => product.cartItems)
  @typeorm.JoinColumn({ name: 'productId' })
  product: typeorm.Relation<Product>;

  @typeorm.Column({ type: 'int', default: 1 })
  quantity: number;
}