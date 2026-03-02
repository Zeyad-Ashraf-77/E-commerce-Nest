import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import { paymentMethodEnum, status } from "src/cammon/enume";
@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Order {
    @Prop({ required: true, type: Types.ObjectId, ref: "User"})
    userId: Types.ObjectId
    @Prop({ required: true, type: Types.ObjectId, ref: "Cart"})
    cart:Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: "Coupon"})
    coupon:Types.ObjectId
    @Prop({ required: true, minLength: 3, maxLength: 10, trim: true})
    address: string
    @Prop({ required: true, minLength: 11, maxLength: 11, trim: true})
    phone: string
    @Prop({ required: true, min: 1, type: Number})
    totalPrice: number
    @Prop({ required: true, enum: paymentMethodEnum,type:String})
    paymentMethod: string
    @Prop({ required: true, enum: status ,type:String})
    status: string
    @Prop({ type: Date ,default:Date.now() + 5 * 24 * 60 * 60 * 1000 })
    arriveAt: Date
    @Prop({ type: String })
    paymentIntent:string
    @Prop({ type: {
      paidAt:Date,
      deliveredAt:Date,
      cancelledAt:Date,
      refunderAt:Date,
      deliveredBy:{type:Types.ObjectId,ref:"User"},
      cancelledBy:{type:Types.ObjectId,ref:"User"},
      refunderBy:{type:Types.ObjectId,ref:"User"},
    } })
    orderChanges:object
}
export type hydratedOrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderModel = MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
]);
