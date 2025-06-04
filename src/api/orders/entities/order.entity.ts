import { Orders } from "@prisma/client";

export class Order {
    /**
     * Id do pedido
     * @example 7
    */
    public readonly id: number;

    /**
     * Id do comprador
     * @example 3
    */
    public readonly customer_id: number;

    /**
     * Status do pedido
     * @example "Pendente"
     * @example "Faturado"
     * @example "Cancelado"
     * @example "Entregue"
    */
    public readonly status: string;

    /**
     * Total do pedido
     * @example 207.93
    */
    public readonly total: number;

    /**
     * Data de entrega estimada
     * @example "2025-06-02T04:33:12.982Z"
    */
    public readonly estimated_delivery_at: Date;

    /**
     * Data de criação do pedido
     * @example "2025-06-02T04:33:12.982Z"
    */
    public readonly created_at: Date;

    /**
     * Data da ultima atualização no pedido
     * @example "2025-06-02T04:33:12.982Z"
    */
    public readonly updated_at: Date;

    /**
     * Referência externa que pode ser usado para identificar pedidos realizados através de upload de arquivos csv
     * @example "ORDER-001"
    */
    public readonly external_ref: string | null;

    constructor(
        id: number,
        customer_id: number,
        status: string,
        total: number,
        estimated_delivery_at: Date,
        created_at: Date,
        updated_at: Date,
        external_ref: string | null
    ) {
        this.id = id
        this.customer_id = customer_id;
        this.status = status;
        this.total = total;
        this.estimated_delivery_at = estimated_delivery_at;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.external_ref = external_ref ? external_ref : null;
    }

    static fromRaw(raw: Orders): Order {
        return new Order(
            raw.id,
            raw.customer_id,
            raw.status,
            raw.total,
            raw.estimated_delivery_at,
            raw.created_at,
            raw.updated_at,
            raw.external_ref
        );
    }

    static fromRawArray(rawArray: Orders[]): Order[] {
        return rawArray.map((rawOrder) => {
            return Order.fromRaw(rawOrder)
        });
    }
}