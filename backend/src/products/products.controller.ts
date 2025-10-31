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
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ProductDocument } from './schemas/product.schema';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear producto',
    description: 'Crea un nuevo producto en el catálogo',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Datos del producto a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT requerido',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.create(createProductDto);
    return this.mapToResponseDto(product);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar productos',
    description: 'Obtiene todos los productos del catálogo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT requerido',
  })
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsService.findAll();
    return products.map((product) => this.mapToResponseDto(product));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener producto',
    description: 'Obtiene un producto específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT requerido',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return this.mapToResponseDto(product);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar producto',
    description: 'Actualiza un producto existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto a actualizar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateProductDto,
    description:
      'Datos del producto a actualizar (todos los campos son opcionales)',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT requerido',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.update(id, updateProductDto);
    return this.mapToResponseDto(product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar producto',
    description: 'Elimina un producto del catálogo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto a eliminar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT requerido',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.productsService.remove(id);
  }

  private mapToResponseDto(product: ProductDocument): ProductResponseDto {
    return {
      id: String(product._id),
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
    };
  }
}
