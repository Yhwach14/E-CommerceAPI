import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, IsUrl, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    name:string

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 }, 
    { message: 'Price must be a number with up to 2 decimal places.' })
    @Min(0.01, { message: 'Price must be greater than or equal to 0.01.' })
    price: number;

    @IsUrl()
    imageUrl: string;

    @IsString()
    sku: string;

    @IsInt()
    @Min(0)
    stockQuantity: number;

    @IsBoolean()
    isActive: boolean = true;

    @IsInt()
    categoryId:number
}
