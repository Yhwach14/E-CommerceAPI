import * as typeorm from 'typeorm';
import { Category } from '../../categories/entities/category.entity.js';
import { CartItem } from '../../cart/entities/cart-item.entity.js';

@typeorm.Entity()

export class Product {
    @typeorm.PrimaryGeneratedColumn()
    id: number;

    @typeorm.Column()
    name: string;

    @typeorm.Column()
    description: string;

    @typeorm.Column({ unique: true })
    slug: string;

    @typeorm.Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @typeorm.Column({default:1})
    isActive: boolean;

    @typeorm.Column()
    imageUrl: string;

    @typeorm.Column({ unique: true })
    sku: string;

    @typeorm.Column({default: 0})
    stockQuantity: number;

    @typeorm.ManyToOne(() => Category, (category) => category.products)
    @typeorm.JoinColumn({ name: 'categoryId' })
    category: typeorm.Relation<Category>;

    @typeorm.OneToMany(() => CartItem, (cartItem) => cartItem.product)
    cartItems: typeorm.Relation<CartItem[]>;
    
}
