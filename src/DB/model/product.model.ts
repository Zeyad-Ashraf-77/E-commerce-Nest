import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Product {
  @Prop({ required: true, minLength: 3, maxLength: 300, trim: true })
  name: string

  @Prop({ required: true, minLength: 30, maxLength: 30000, trim: true })
  discraption: string

  @Prop({type: Number ,min: 1})
  quantity: number

  @Prop({ type: String, required: true })
  mainImage: string
  @Prop({ type: [String] })
  subImages: string[]

  @Prop({ required: true, type: Number })
  price: number

  @Prop({ type: Number, min: 1, max: 100 })
  discount: number

  @Prop({ required: true, type: Number })
  stock: number

  @Prop({ type: Number, min: 1, max: 5 })
  rate: number

  @Prop({ type: Number })
  rateAverage: number

  @Prop({ type: Types.ObjectId, ref: "Brand", required: true })
  brand: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  category: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "SubCategory", required: true })
  subCategory: Types.ObjectId

  @Prop({
    type: String, default: function () {
      return slugify(this.name, { replacement: "_", lower: true, trim: true })
    }
  })
  slug: string
  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId
  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: Types.ObjectId
  @Prop({ type: Types.ObjectId, ref: "User" })
  deletedBy: Types.ObjectId
  @Prop({ type: Types.ObjectId, ref: "User" })
  restoredBy: Types.ObjectId
  @Prop({ type: Date })
  deletedAt: Date
  @Prop({ type: Date })
  restoredAt: Date
}
export type hydratedProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre(
  ['findOneAndUpdate', 'updateOne'],
  async function () {
    const update = this.getUpdate() as UpdateQuery<Product>
    if (update.name) {
      update.slug = slugify(update.name, { replacement: "_", lower: true, trim: true })
    }
  }
);
ProductSchema.pre(["findOne", "find", "findOneAndDelete"], function (next) {
  const query = this.getQuery();
  const { paranoid, ...rest } = query;
  if (paranoid === false) {
    this.setQuery({ ...rest, deletedAt: { $exists: true } })
  } else {
    this.setQuery({ ...rest, deletedAt: { $exists: false } })
  }
})


export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);
