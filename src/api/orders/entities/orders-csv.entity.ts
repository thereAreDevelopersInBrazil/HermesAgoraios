import { Order } from "./order.entity";

export class OrdersCsv {
    /**
     * Lista de ordens criadas com sucesso pela importação de arquivo csv
    */
    orders: Order[];

    /**
     * Lista de alertas e erros ocorridos durante a importação de arquivo csv
     * @example ""
    */
    warnings: [string, string[]][];

}