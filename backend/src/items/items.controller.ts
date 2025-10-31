import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemResponseDto } from './dto/item-response.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';
import { ItemDocument } from './schemas/item.schema';

@ApiTags('Items')
@ApiBearerAuth('JWT-auth')
@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create item',
    description: 'Creates a new item (product or event) in the catalog',
  })
  @ApiBody({
    type: CreateItemDto,
    description: 'Item data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Item created successfully',
    type: ItemResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token required',
  })
  async create(@Body() createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    const item = await this.itemsService.create(createItemDto);
    return this.mapToResponseDto(item);
  }

  @Get()
  @ApiOperation({
    summary: 'List items',
    description: 'Gets all items (products and events) from the catalog',
  })
  @ApiResponse({
    status: 200,
    description: 'List of items retrieved successfully',
    type: [ItemResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token required',
  })
  async findAll(): Promise<ItemResponseDto[]> {
    const items = await this.itemsService.findAll();
    return items.map((item) => this.mapToResponseDto(item));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get item',
    description: 'Gets a specific item by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Item ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Item retrieved successfully',
    type: ItemResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
  })
  async findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    const item = await this.itemsService.findOne(id);
    return this.mapToResponseDto(item);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update item',
    description: 'Updates an existing item',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the item to update',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateItemDto,
    description:
      'Item data to update (all fields are optional)',
  })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully',
    type: ItemResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    const item = await this.itemsService.update(id, updateItemDto);
    return this.mapToResponseDto(item);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete item',
    description: 'Deletes an item from the catalog',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the item to delete',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 204,
    description: 'Item deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token required',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.itemsService.remove(id);
  }

  private mapToResponseDto(item: ItemDocument): ItemResponseDto {
    return {
      id: String(item._id),
      type: item.type,
      name: item.name,
      description: item.description,
      price: item.price,
      thumbnail: item.thumbnail,
      stock: item.stock,
      category: item.category,
      eventDate: item.eventDate,
      location: item.location,
      capacity: item.capacity,
      startTime: item.startTime,
      endTime: item.endTime,
      createdAt: item.createdAt || new Date(),
      updatedAt: item.updatedAt || new Date(),
    };
  }
}

