import { User } from '../types/User.js';
import { UserModel } from '../models/UserModel.js';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
}

export class MongooseUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    if (!doc) {
      return null;
    }
    return {
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      name: doc.name,
      createdAt: doc.createdAt
    };
  }

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const doc = await UserModel.create(user);
    return {
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      name: doc.name,
      createdAt: doc.createdAt
    };
  }
}
