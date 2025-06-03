import { Customers } from "@prisma/client";

export class Customer {

    /**
     * Id do consumidor
     * @example 7
    */
    public readonly id: number;

    /**
     * Nome do consumidor
     * @example "Natanael Felipe"
    */
    public readonly name: string;

    /**
     * Email do consumidor
     * @example "email@sample.com"
    */
    public readonly email: string;

    constructor(
        id: number,
        name: string,
        email: string,
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    static fromRaw(raw: Customers): Customer {
        return new Customer(
            raw.id,
            raw.name,
            raw.email,
        );
    }

    static fromRawArray(rawArray: Customers[]): Customer[] {
        return rawArray.map((rawCustomer) => {
            return Customer.fromRaw(rawCustomer)
        });
    }
}