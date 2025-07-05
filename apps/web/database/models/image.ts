import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IImage extends Document {
  userId: string;
  url: string;
  name: string;
  uploadedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  userId: { type: String, required: true },
  url: { type: String, required: true },
  name: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default (models.Image as mongoose.Model<IImage>) || model<IImage>("Image", ImageSchema);
