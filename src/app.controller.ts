import {
  Controller,
  Logger,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateFoodShopDto } from './dto/update-food-shop.dto'; // Assuming the DTO exists

@Controller('/api/food_shops')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':food_shop_id')
  getFoodShopDetails(
    @Param('food_shop_id') foodShopId: string,
  ): Promise<{ contract_status: string; shop_name: string; status: string }> {
    return this.appService.getFoodShopDetails(foodShopId);
  }

  @Put(':id')
  async updateFoodShop(
    @Param('id', ParseIntPipe) food_shop_id: number,
    @Body() updateFoodShopDto: UpdateFoodShopDto,
  ): Promise<{ status: number; message: string }> {
    try {
      await this.appService.checkFoodShopEditableStatus(food_shop_id.toString());
    } catch (error) {
      throw error;
    }
    if (typeof updateFoodShopDto.shop_name !== 'string' || updateFoodShopDto.shop_name.length > 50) {
      throw new BadRequestException('50 文字以内で入力してください');
    }
    if (!['Publish', 'Pending'].includes(updateFoodShopDto.status)) {
      throw new BadRequestException('Invalid status value.');
    }
    try {
      await this.appService.updateFoodShop(food_shop_id.toString(), updateFoodShopDto);
      return { status: 200, message: 'Editing completed' };
    } catch (error) {
      if (error.status === HttpStatus.UNPROCESSABLE_ENTITY) {
        throw new HttpException('Wrong format.', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      this.logger.error(`Failed to update food shop: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Get(':id/edit_permission')
  async checkEditPermission(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
  ): Promise<{ permission: boolean }> {
    try {
      const hasPermission = await this.appService.checkEditPermission(id.toString());
      if (!hasPermission) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return { permission: hasPermission };
    } catch (error) {
      if (error.status === HttpStatus.FORBIDDEN) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/check-user-edit-permission')
  async checkUserEditPermission(
    @Body('userId') userId: string,
    @Body('foodShopId') foodShopId: string,
  ): Promise<boolean> {
    try {
      return await this.appService.checkEditPermission(userId, foodShopId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}
