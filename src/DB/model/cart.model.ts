import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class CartProduct {
    @Prop({ type: Types.ObjectId, ref: "Product"})
    product: Types.ObjectId
    @Prop({ type: Number, required: true })
    quantity: number
    @Prop({ type: Number })
    price: number
    @Prop({ type: Types.ObjectId, ref: "User"})
    createdBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: "User" })
    deletedBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: "User" })
    restoredBy: Types.ObjectId
    @Prop({ type: Date })
    deletedAt: Date
    @Prop({ type: Date })
    restoredAt: Date
}
@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Cart {
    @Prop({ type: [CartProduct], required: true })
    products: CartProduct[]
    @Prop({ type: Number})
    supTotal: number
    @Prop({ type: Types.ObjectId, ref: "User"})
    createdBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: "User" })
    deletedBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: "User" })
    restoredBy: Types.ObjectId
    @Prop({ type: Date })
    deletedAt: Date
    @Prop({ type: Date })
    restoredAt: Date
}
export type hydratedCartDocument = HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre("save",
    function () {
        this.supTotal = this.products.reduce((acc, product) => acc + product.price * product.quantity, 0)
    }
);
CartSchema.pre(["findOne","find","findOneAndDelete"],function(next){
    const query = this.getQuery();
    const {paranoid,...rest} = query;
    if(paranoid===false){
      this.setQuery({...rest,deletedAt:{$exists:true}})
    }else{
      this.setQuery({...rest,deletedAt:{$exists:false}})
    }
})


export const CartModel = MongooseModule.forFeature([
    { name: Cart.name, schema: CartSchema },
]);
