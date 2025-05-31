import { Products } from "generated/prisma";

export class Product {
    /**
   * Id do produto
   * @example 7
   */
    public readonly id: number;

    /**
     * Nome do produto
     * @example "Café"
     */
    public readonly name: string;

    /**
     * Código do produto
     * @example "COF_02368"
     */
    public readonly code: string;

    /**
     * Preço unitário do produto
     * @example 37.30
     */
    public readonly price: number;

    /**
     * URL da imagem do produto
     * @example "https://my.image.com/product.png"
     */
    public readonly photo: string;

    constructor(
        id: number,
        name: string,
        code: string,
        price: number,
        photo: string
    ) {
        this.id = id
        this.name = name;
        this.code = code;
        this.price = price;
        this.photo = photo;
    }

    static fromRaw(raw: Products): Product {
        return new Product(
            raw.id,
            raw.name,
            raw.code,
            raw.price,
            raw.photo
        );
    }

    static fromRawArray(rawArray: Products[]): Product[] {
        return rawArray.map((rawProduct) => {
            return Product.fromRaw(rawProduct)
        });
    }
}
