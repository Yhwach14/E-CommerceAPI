import * as typeorm from 'typeorm';
import { Order } from '../../orders/entities/order.entity.js';
import { CartItem } from '../../cart/entities/cart-item.entity.js';
import { Role } from '../../common/enums/role.enum.js';



@typeorm.Entity()

export class User {
    @typeorm.PrimaryGeneratedColumn()
    id: number;

    @typeorm.Column()
    firstName: string;
    
    @typeorm.Column()
    lastName: string;
    
    @typeorm.Column({ unique: true })
    email: string;
    
    @typeorm.Column()
    password: string;
    
    @typeorm.Column({type: 'enum', enum: Role, default: Role.USER})
    role: Role;
    
    @typeorm.CreateDateColumn()
    createdAt: Date;

    @typeorm.OneToMany(() => Order, (order) => order.user)
    orders: typeorm.Relation<Order[]>;

    @typeorm.OneToMany(() => CartItem, (cartItem) => cartItem.user)
    cartItems: typeorm.Relation<CartItem[]>;
}

