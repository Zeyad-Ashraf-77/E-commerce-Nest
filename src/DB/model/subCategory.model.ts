import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class subCategory {
  @Prop({ required: true, minLength: 3, maxLength: 30, trim: true, unique: true })
  name: string
  @Prop({ type: String, required: true })
  image: string
  @Prop([{ type: Types.ObjectId, ref: "category" }])
  category: Types.ObjectId[]
  @Prop({ type: String })
  folderAsetId: string
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
export type hydratedsubCategoryDocument = HydratedDocument<subCategory>;
export const subCategorySchema = SchemaFactory.createForClass(subCategory);

subCategorySchema.pre(
  ['findOneAndUpdate', 'updateOne'],
  async function () {
    const update = this.getUpdate() as UpdateQuery<subCategory>
    if (update.name) {
      update.slug = slugify(update.name, { replacement: "_", lower: true, trim: true })
    }
  }
);
subCategorySchema.pre(["findOne", "find", "findOneAndDelete"], function (next) {
  const query = this.getQuery();
  const { paranoid, ...rest } = query;
  if (paranoid === false) {
    this.setQuery({ ...rest, deletedAt: { $exists: true } })
  } else {
    this.setQuery({ ...rest, deletedAt: { $exists: false } })
  }
})


export const subCategoryModel = MongooseModule.forFeature([
  { name: subCategory.name, schema: subCategorySchema },
]);
