import mongoose, { Schema, Document, models, model } from "mongoose";

import { myImageType } from "@repo/ui/types/myImage";

export interface IImage extends Omit<myImageType, "_id">, Document {}

const ImageSchema = new Schema<IImage>({
  userId: { type: String, required: true },
  url: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  detectedType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default (models.Image as mongoose.Model<IImage>) ||
  model<IImage>("Image", ImageSchema);
