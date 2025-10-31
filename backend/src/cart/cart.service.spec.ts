import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { ItemsService } from '../items/items.service';
import { CheckStockDto } from './dto/check-stock.dto';
import { CartValidationDto } from './dto/cart-validation.dto';
import { ItemType } from '../items/schemas/item.schema';

describe('CartService', () => {
  let service: CartService;
  let itemsService: ItemsService;

  const mockItemsService = {
    getAvailableStock: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: ItemsService,
          useValue: mockItemsService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    itemsService = module.get<ItemsService>(ItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkStock', () => {
    it('should return available stock information when stock is sufficient', async () => {
      const checkStockDto: CheckStockDto = {
        itemId: '507f1f77bcf86cd799439011',
        quantity: 5,
      };

      mockItemsService.getAvailableStock.mockResolvedValue(10);

      const result = await service.checkStock(checkStockDto);

      expect(result).toEqual({
        available: true,
        availableStock: 10,
        requestedQuantity: 5,
      });
      expect(itemsService.getAvailableStock).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should return unavailable when stock is insufficient', async () => {
      const checkStockDto: CheckStockDto = {
        itemId: '507f1f77bcf86cd799439011',
        quantity: 15,
      };

      mockItemsService.getAvailableStock.mockResolvedValue(10);

      const result = await service.checkStock(checkStockDto);

      expect(result).toEqual({
        available: false,
        availableStock: 10,
        requestedQuantity: 15,
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      const checkStockDto: CheckStockDto = {
        itemId: 'invalid-id',
        quantity: 5,
      };

      mockItemsService.getAvailableStock.mockRejectedValue(
        new NotFoundException('Item not found'),
      );

      await expect(service.checkStock(checkStockDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validateCart', () => {
    it('should return valid cart when all items are available', async () => {
      const cartValidationDto: CartValidationDto = {
        items: [
          { itemId: '507f1f77bcf86cd799439011', quantity: 5 },
          { itemId: '507f1f77bcf86cd799439012', quantity: 3 },
        ],
      };

      mockItemsService.getAvailableStock
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(5);

      const result = await service.validateCart(cartValidationDto);

      expect(result).toEqual({
        isValid: true,
        errors: [],
      });
    });

    it('should return invalid cart with errors when stock is insufficient', async () => {
      const cartValidationDto: CartValidationDto = {
        items: [
          { itemId: '507f1f77bcf86cd799439011', quantity: 15 },
          { itemId: '507f1f77bcf86cd799439012', quantity: 3 },
        ],
      };

      mockItemsService.getAvailableStock
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(5);

      const result = await service.validateCart(cartValidationDto);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('insufficient stock');
    });

    it('should handle item not found errors', async () => {
      const cartValidationDto: CartValidationDto = {
        items: [{ itemId: 'invalid-id', quantity: 5 }],
      };

      mockItemsService.getAvailableStock.mockRejectedValue(
        new NotFoundException('Item not found'),
      );

      const result = await service.validateCart(cartValidationDto);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('not found');
    });

    it('should validate multiple items and collect all errors', async () => {
      const cartValidationDto: CartValidationDto = {
        items: [
          { itemId: '507f1f77bcf86cd799439011', quantity: 15 },
          { itemId: 'invalid-id', quantity: 3 },
          { itemId: '507f1f77bcf86cd799439013', quantity: 20 },
        ],
      };

      mockItemsService.getAvailableStock
        .mockResolvedValueOnce(10)
        .mockRejectedValueOnce(new NotFoundException('Item not found'))
        .mockResolvedValueOnce(5);

      const result = await service.validateCart(cartValidationDto);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(3);
    });
  });
});

