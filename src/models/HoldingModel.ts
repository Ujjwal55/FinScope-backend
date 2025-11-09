import mongoose, { Schema } from 'mongoose';

const HoldingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    exchange: { type: String, required: true },
    sector: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  { timestamps: true }
);

export const HoldingModel = mongoose.model('Holding', HoldingSchema);
