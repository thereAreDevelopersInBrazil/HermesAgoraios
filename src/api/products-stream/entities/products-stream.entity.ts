export class ProductStream {
    /**
   * Id do produto
   * @example 7
   */
    public readonly id: number;

    /**
     * Disponibilidade do produto
     * @example "Disponível"
     * @example "Indisponível"
     */
    public readonly availability: string;

    /**
     * Estoque disponível do produto
     * @example 3
     */
    public readonly inventory: number;

    /**
     * Data da ultima compra
     * @example "2025-05-27T04:33:12.982Z" || null
     */
    public readonly lastBuy: Date | null;

    constructor(
        id: number,
        availability: string,
        inventory: number,
        lastBuy: Date
    ) {
        this.id = id
        this.availability = availability;
        this.inventory = inventory;
        this.lastBuy = lastBuy;
    }
}
