export class ProductLastBuy {
    /**
     * Data da última vez que o consumidor comprou o produto
     * @example "2025-06-02T04:33:12.982Z"
    */
    public readonly lastBuyDate: Date | null;

    constructor(
        lastBuyDate: string
    ) {
        this.lastBuyDate = new Date(lastBuyDate);
    }

    static fromRaw(raw: { lastBuyDate: string }): ProductLastBuy {
        return new ProductLastBuy(
            raw.lastBuyDate
        );
    }

    static fromRawArray(rawArray: { lastBuyDate: string }[]): ProductLastBuy[] {
        return rawArray.map((rawProduct) => {
            return ProductLastBuy.fromRaw(rawProduct)
        });
    }
}
