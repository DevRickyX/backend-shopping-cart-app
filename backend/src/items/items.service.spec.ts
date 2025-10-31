import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item, ItemDocument } from './schemas/item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemType } from './schemas/item.schema';

describe('ItemsService', () => {
  let service: ItemsService;
  let model: Model<ItemDocument>;

  const mockItem = {
    _id: '507f1f77bcf86cd799439011',
    type: ItemType.PRODUCT,
    name: 'Test Product',
    description: 'Test Description',
    price: 100.0,
    stock: 10,
    category: 'Test Category',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockItemDocument = {
    ...mockItem,
    save: jest.fn().mockResolvedValue(mockItem),
  } as unknown as ItemDocument;

  const mockModel = {
    new: jest.fn().mockResolvedValue(mockItemDocument),
    constructor: jest.fn().mockResolvedValue(mockItemDocument),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getModelToken(Item.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    model = module.get<Model<ItemDocument>>(getModelToken(Item.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const createItemDto: CreateItemDto = {
        type: ItemType.PRODUCT,
        name: 'Test Product',
        description: 'Test Description',
        price: 100.0,
        stock: 10,
        category: 'Test Category',
      };

      jest.spyOn(model, 'create').mockResolvedValue(mockItemDocument as any);

      const result = await service.create(createItemDto);

      expect(model.create).toHaveBeenCalledWith(createItemDto);
      expect(result).toEqual(mockItemDocument);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems = [mockItemDocument];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockItems),
      } as any);

      const result = await service.findAll();

      expect(model.find).toHaveBeenCalled();
      expect(result).toEqual(mockItems);
    });
  });

  describe('findOne', () => {
    it('should return a single item', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockItemDocument),
      } as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(model.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockItemDocument);
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.findOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedItem = { ...mockItemDocument, name: 'Updated Name' };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedItem),
      } as any);

      const result = await service.update('507f1f77bcf86cd799439011', updateDto);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateDto,
        { new: true },
      );
      expect(result).toEqual(updatedItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.update('507f1f77bcf86cd799439011', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an item', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockItemDocument),
      } as any);

      await service.remove('507f1f77bcf86cd799439011');

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.remove('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkStock', () => {
    it('should return true if stock is available', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockItemDocument);

      const result = await service.checkStock('507f1f77bcf86cd799439011', 5);

      expect(result).toBe(true);
    });

    it('should return false if stock is insufficient', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockItemDocument);

      const result = await service.checkStock('507f1f77bcf86cd799439011', 15);

      expect(result).toBe(false);
    });
  });

  describe('getAvailableStock', () => {
    it('should return available stock', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockItemDocument);

      const result = await service.getAvailableStock('507f1f77bcf86cd799439011');

      expect(result).toBe(10);
    });
  });
});

