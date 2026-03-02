import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import type { userRequest } from 'src/cammon/interfaces';
import { Auth } from 'src/cammon/decretors';
import { UserRole } from 'src/cammon/enume';
import { TokenType } from 'src/cammon/enume';
import { CreateOrderDto } from './order.dto';
import { OrderService } from './order.service';
import { paramDto } from '../product/product.dto';
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Post()
    async createorder(
        @Body() orderDto: CreateOrderDto,
        @Req() req: userRequest) {
        const order = await this.orderService.createorder(orderDto, req);
        return { message: "successfully", order };
    }
    @Auth(TokenType.access, [UserRole.ADMIN])
    @Post("stripe/:id")
    async paymentWithStripe(
        @Param() paramDto: paramDto,
        @Req() req: userRequest) {
        const order = await this.orderService.paymentWithStripe(paramDto.id, req);
        return { message: "successfully", order };
    }

    @Post("/webhook")
    async webhook(
        @Body() body: any,
    ) {
       await this.orderService.webhook(body)
    }

    @Patch("/:id")
    @Auth(TokenType.access, [UserRole.ADMIN])
    async refunderOrder(@Param() params: paramDto , @Req() req: userRequest){
        const order = await this.orderService.refunderOrder(params.id, req);
        return { message: "successfully", order };
    }

}
