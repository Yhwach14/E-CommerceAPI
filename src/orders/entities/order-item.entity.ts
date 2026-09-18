import * as typeorm from 'typeorm';
import { Order } from './order.entity.js';
import { Product } from '../../products/entities/product.entity.js';

@typeorm.Entity()
export class OrderItem {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

  @typeorm.ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: typeorm.Relation<Order>;

  @typeorm.ManyToOne(() => Product, { nullable: true })
  product: typeorm.Relation<Product> | null;

  @typeorm.Column()
  productName: string;

  @typeorm.Column()
  sku: string;

  @typeorm.Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @typeorm.Column()
  quantity: number;
}