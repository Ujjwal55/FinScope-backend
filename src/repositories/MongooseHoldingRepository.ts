import { Holding } from '../types/Holding.js';
import { HoldingModel } from '../models/HoldingModel.js';

export interface HoldingRepository {
  list(userId: string): Promise<Holding[]>;
  getById(id: string, userId: string): Promise<Holding | null>;
  create(h: Omit<Holding, 'id'>): Promise<Holding>;
  update(id: string, userId: string, h: Partial<Omit<Holding, 'id' | 'userId'>>): Promise<Holding | null>;
  delete(id: string, userId: string): Promise<boolean>;
}

export class MongooseHoldingRepository implements HoldingRepository {
  async list(userId: string): Promise<Holding[]> {
    const docs = await HoldingModel.find({ userId }).lean().exec();
    // console.log("docsssss", docs);
    return docs.map(this.mapDoc);
  }

  async getById(id: string, userId: string): Promise<Holding | null> {
    const doc = await HoldingModel.findOne({ _id: id, userId }).lean().exec();
    return doc ? this.mapDoc(doc) : null;
  }

  async create(h: Omit<Holding, 'id'>): Promise<Holding> {
    const doc = await HoldingModel.create(h);
    // console.log("docsssss", doc);
    return this.mapDoc(doc.toObject());
  }

  async update(id: string, userId: string, h: Partial<Omit<Holding, 'id' | 'userId'>>): Promise<Holding | null> {
    const doc = await HoldingModel.findOneAndUpdate(
      { _id: id, userId },
      h,
      { new: true }
    ).lean().exec();
    return doc ? this.mapDoc(doc) : null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const res = await HoldingModel.findOneAndDelete({ _id: id, userId }).lean().exec();
    const deleted = !!res;
    return deleted;
  }

  private mapDoc(doc: any): Holding {
    return {
      id: doc._id?.toString?.() ?? doc.id,
      userId: doc.userId?.toString?.() ?? doc.userId,
      symbol: doc.symbol,
      name: doc.name,
      exchange: doc.exchange,
      sector: doc.sector,
      purchasePrice: doc.purchasePrice,
      quantity: doc.quantity
    };
  }
}
