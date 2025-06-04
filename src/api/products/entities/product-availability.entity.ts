export class ProductAvailability {
    /**
     * Disponibilidade do produto
     * @example true
     * @example false
    */
    public readonly available: boolean | null;

    /**
     * Quantidade disponível
     * @example 3
    */
    public readonly quantity: number | null;

    constructor(
        available: boolean | null,
        quantity: number | null
    ) {
        this.available = available
        this.quantity = quantity;
    }

    static fromRaw(raw: ProductAvailability): ProductAvailability {
        return new ProductAvailability(
            raw.available,
            raw.quantity
        );
    }

    static fromRawArray(rawArray: ProductAvailability[]): ProductAvailability[] {
        return rawArray.map((rawProduct) => {
            return ProductAvailability.fromRaw(rawProduct)
        });
    }
}
