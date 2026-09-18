import * as typeorm from 'typeorm';
import { Product } from '../../products/entities/product.entity.js';

@typeorm.Entity()

export class Category {
    @typeorm.PrimaryGeneratedColumn()
    id: number;

    @typeorm.Column()
    name: string;

    @typeorm.Column({ unique: true })
    slug: string;

    @typeorm.Column()
    isActive: boolean;

    @typeorm.OneToMany(() => Product, (product) => product.category)
    products: typeorm.Relation<Product[]>;  
}
