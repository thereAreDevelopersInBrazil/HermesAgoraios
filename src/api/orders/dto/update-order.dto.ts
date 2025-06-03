import { ApiProperty } from '@nestjs/swagger';
import { OrdersStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';


export class UpdateOrderDto {
    @ApiProperty({
        enum: OrdersStatus,
        description: `Status do Pedido:<br/>
        - Pendente<br/>
        - Faturado<br/>
        - Cancelado<br/>
        - Entregue<br/>
        Outros valores não são aceitos.`,
        example: OrdersStatus.Faturado,
    })
    @IsNotEmpty({ message: 'O status do pedido é obrigatório!' })
    @IsEnum(OrdersStatus, {
        message: 'Os status aceitos são apenas: Pendente, Faturado, Cancelado, Entregue',
    })
    status: OrdersStatus

}
