import { Controller, Get, Post, Put, Body, Param, HttpException, HttpStatus, InternalServerErrorException, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateFoodShopDto } from './dto/update-food-shop.dto'; // Assuming the DTO exists

@Controller('/api/food_shops')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':food_shop_id')
  getFoodShopDetails(@Param('food_shop_id') foodShopId: string): Promise<{ contract_status: string; shop_name: string; status: string; }> {
    return this.appService.getFoodShopDetails(foodShopId);
  }

  @Put(':id')
  async updateFoodShop(
    @Param('id', ParseIntPipe) food_shop_id: number,
    @Body() updateFoodShopDto: UpdateFoodShopDto,
  ): Promise<{ status: number; message: string; }> {
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
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Post('/check-user-edit-permission')
  async checkUserEditPermission(@Body('userId') userId: string, @Body('foodShopId') foodShopId: string): Promise<boolean> {
    try {
      return await this.appService.checkEditPermission(userId, foodShopId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}
