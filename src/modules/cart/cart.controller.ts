import {
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateCartDto,
  paramDto,
  UpdateCartDto,
  UpdateQuantityDto,
} from './cart.dto';
import type { userRequest } from 'src/cammon/interfaces';
import { Auth } from 'src/cammon/decretors';
import { UserRole } from 'src/cammon/enume';
import { TokenType } from 'src/cammon/enume';

import { CartService } from './cart.service';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Auth(TokenType.access, [UserRole.ADMIN, UserRole.USER])
  @Post()
  async createCart(@Body() cartDto: CreateCartDto, @Req() req: userRequest) {
    const cart = await this.cartService.createCart(cartDto, req);
    return { message: 'successfully', cart };
  }
  @Auth(TokenType.access, [UserRole.ADMIN, UserRole.USER])
  @Delete('clear')
  async clearCart(@Req() req: userRequest) {
    const cart = await this.cartService.clearCart(req);
    return { message: 'successfully', cart };
  }
  @Auth(TokenType.access, [UserRole.ADMIN, UserRole.USER])
  @Patch('update/:id')
  async updateProductFromCart(
    @Param() param: paramDto,
    @Body() updateQuantityDto: UpdateQuantityDto,
    @Req() req: userRequest,
  ) {
    const cart = await this.cartService.updateProductFromCart(
      param.id,
      updateQuantityDto,
      req,
    );
    return { message: 'successfully', cart };
  }
  @Auth(TokenType.access, [UserRole.ADMIN, UserRole.USER])
  @Delete(':id')
  async removeProductFromCart(
    @Param() param: paramDto,
    @Req() req: userRequest,
  ) {
    const cart = await this.cartService.removeProductFromCart(param.id, req);
    return { message: 'successfully', cart };
  }
}
