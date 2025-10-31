import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

export enum ItemType {
  PRODUCT = 'product',
  EVENT = 'event',
}

@Schema({ discriminatorKey: 'type', timestamps: true })
export class Item {
  @Prop({ required: true, enum: ItemType })
  type: ItemType;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, min: 0.01 })
  price: number;

  @Prop()
  thumbnail?: string;

  @Prop({ required: true, default: 0, min: 0 })
  stock: number;

  // Product-specific fields
  @Prop()
  category?: string;

  // Event-specific fields
  @Prop()
  eventDate?: Date;

  @Prop()
  location?: string;

  @Prop({ min: 1 })
  capacity?: number;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;

  // Timestamps (added by Mongoose when timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

