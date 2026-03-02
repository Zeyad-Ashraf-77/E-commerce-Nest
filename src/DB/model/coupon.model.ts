import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Coupon {
    @Prop({ required: true,unique:true, minLength: 3, maxLength: 30, trim: true,lowercase:true })
    code: string
    @Prop({ required: true, type:Number })
    amount:number
    @Prop({ required: true, type:Date })
    fromDate:Date
    @Prop({ required: true, type:Date })
    toDate:Date
    @Prop({ type: Types.ObjectId, ref: "User"})
    createdBy: Types.ObjectId
    @Prop({ type: [{type: Types.ObjectId, ref: "User"}]})
    usedBy: Types.ObjectId[]
    @Prop({ type: Date })
    deletedAt: Date
    @Prop({ type: Date })
    restoredAt: Date

}
export type hydratedCouponDocument = HydratedDocument<Coupon>;
export const CouponSchema = SchemaFactory.createForClass(Coupon);


export const CouponModel = MongooseModule.forFeature([
    { name: Coupon.name, schema: CouponSchema },
]);
