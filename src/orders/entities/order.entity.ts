import * as typeorm from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { OrderItem } from './order-item.entity.js';

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@typeorm.Entity()
export class Order {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

  @typeorm.ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn({ name: 'userId' })
  user: typeorm.Relation<User>;

  @typeorm.Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @typeorm.Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @typeorm.CreateDateColumn()
  createdAt: Date;

  @typeorm.OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: typeorm.Relation<OrderItem[]>;
}