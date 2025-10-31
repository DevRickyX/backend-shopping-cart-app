import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ItemsService } from '../items/items.service';
import {
  CartValidationDto,
  CartValidationResponseDto,
} from './dto/cart-validation.dto';
import { CheckStockDto, CheckStockResponseDto } from './dto/check-stock.dto';

@Injectable()
export class CartService {
  constructor(private readonly itemsService: ItemsService) {}

  async checkStock(
    checkStockDto: CheckStockDto,
  ): Promise<CheckStockResponseDto> {
    const { itemId, quantity } = checkStockDto;

    try {
      const availableStock = await this.itemsService.getAvailableStock(itemId);
      const available = availableStock >= quantity;

      return {
        available,
        availableStock,
        requestedQuantity: quantity,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Item with ID ${itemId} not found`);
      }
      throw error;
    }
  }

  async validateCart(
    cartValidationDto: CartValidationDto,
  ): Promise<CartValidationResponseDto> {
    const errors: string[] = [];
    const { items } = cartValidationDto;

    for (const cartItem of items) {
      const { itemId, quantity } = cartItem;

      try {
        const availableStock =
          await this.itemsService.getAvailableStock(itemId);

        if (availableStock < quantity) {
          errors.push(
            `Item ${itemId}: insufficient stock. Available: ${availableStock}, Requested: ${quantity}`,
          );
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          errors.push(`Item ${itemId}: not found`);
        } else {
          errors.push(`Item ${itemId}: validation error`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

