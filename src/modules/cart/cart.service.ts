import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateCartDto,
  paramDto,
  UpdateCartDto,
  UpdateQuantityDto,
} from './cart.dto';
import { userRequest } from 'src/cammon/interfaces';
import { ProductRepo } from 'src/DB/repisitories/product.repo';
import { CartRepo } from 'src/DB/repisitories/cart.repo';
import { Types } from 'mongoose';
import { socketGateway } from '../gateway/socket.gateway';

@Injectable()
export class CartService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly cartRepo: CartRepo,
    private readonly socketGateway: socketGateway,
  ) {}

  // ======================================Create Product======================================
  async createCart(cartDto: CreateCartDto, req: userRequest) {
    const { productId, quantity } = cartDto;
    const product = await this.productRepo.findOne({
      _id: productId,
      stock: { $gte: quantity },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const cart = await this.cartRepo.findOne({ createdBy: req.user._id });
    if (!cart) {
      const newCart = await this.cartRepo.create({
        createdBy: req.user._id,
        products: [
          { product: productId, quantity, price: product.price * quantity },
        ],
      });
      return newCart;
    }
    const productCart = cart.products.find(
      (product) => product.product.toString() === productId,
    );
    if (productCart) {
      throw new BadRequestException('Product already in cart');
    }
    cart.products.push({
      product: productId,
      quantity,
      price: product.price * quantity,
    });
    await cart.save();
    this.socketGateway.handleProductChange(productId,quantity);
    return { message: 'Product added to cart', cart };
  }
  // ======================================Create Product======================================
  async removeProductFromCart(id: Types.ObjectId, req: userRequest) {
    const product = await this.productRepo.findOne({ _id: id });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const cart = await this.cartRepo.findOne({
      createdBy: req.user._id,
      products: { $elemMatch: { product: id } },
    });
    if (!cart) {
      throw new BadRequestException('Cart or product not found');
    }
    cart.products = cart.products.filter(
      (product) => product.product.toString() !== id,
    );
    await cart.save();
    this.socketGateway.handleProductChange(id,0);
    return { message: 'Product removed from cart', cart };
  }
  // ======================================Create Product======================================
  async updateProductFromCart(
    id: Types.ObjectId,
    updateQuantityDto: UpdateQuantityDto,
    req: userRequest,
  ) {
    const { quantity } = updateQuantityDto;
    const cart = await this.cartRepo.findOne({
      createdBy: req.user._id,
      products: { $elemMatch: { product: id } },
    });
    if (!cart) {
      throw new BadRequestException('Cart or product not found');
    }
    cart.products = cart.products.find((product) => {
      if (product.product.toString() === id) {
        product.quantity = quantity;
        product.price = product.price * quantity;
        return product;
      }
    });
    this.socketGateway.handleProductChange(id,quantity);
    await cart.save();
    return { message: 'Product updated in cart', cart };
  }
  // ======================================Create Product======================================
  async clearCart(req: userRequest) {
    const cart = await this.cartRepo.findOneAndUpdate(
      { createdBy: req.user._id },
      { products: [] },
      { new: true },
    );
    if (!cart) {
      throw new BadRequestException('Cart or product not found');
    }
    this.socketGateway.handleProductChange("all",0);
    return { message: 'Cart cleared', cart };
  }
}
