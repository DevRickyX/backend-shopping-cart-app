import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import {
  CartValidationDto,
  CartValidationResponseDto,
} from './dto/cart-validation.dto';
import {
  CheckStockDto,
  CheckStockResponseDto,
} from './dto/check-stock.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('check-stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check stock availability',
    description: 'Checks if an item is available in the requested quantity',
  })
  @ApiBody({
    type: CheckStockDto,
    description: 'Item ID and requested quantity',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock check completed',
    type: CheckStockResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
  })
  async checkStock(
    @Body() checkStockDto: CheckStockDto,
  ): Promise<CheckStockResponseDto> {
    return this.cartService.checkStock(checkStockDto);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate cart',
    description:
      'Validates all items in a cart for stock availability and existence',
  })
  @ApiBody({
    type: CartValidationDto,
    description: 'Cart items to validate',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart validation completed',
    type: CartValidationResponseDto,
  })
  async validateCart(
    @Body() cartValidationDto: CartValidationDto,
  ): Promise<CartValidationResponseDto> {
    return this.cartService.validateCart(cartValidationDto);
  }
}

