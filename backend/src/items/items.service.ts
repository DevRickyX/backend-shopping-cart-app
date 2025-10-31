import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item, ItemDocument } from './schemas/item.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<ItemDocument> {
    const createdItem = new this.itemModel(createItemDto);
    return createdItem.save();
  }

  async findAll(): Promise<ItemDocument[]> {
    return this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<ItemDocument> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async update(
    id: string,
    updateItemDto: UpdateItemDto,
  ): Promise<ItemDocument> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, updateItemDto, { new: true })
      .exec();
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return updatedItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.itemModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }

  async checkStock(itemId: string, requestedQuantity: number): Promise<boolean> {
    const item = await this.findOne(itemId);
    return item.stock >= requestedQuantity;
  }

  async getAvailableStock(itemId: string): Promise<number> {
    const item = await this.findOne(itemId);
    return item.stock;
  }
}

