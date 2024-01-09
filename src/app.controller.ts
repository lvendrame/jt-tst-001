import { Controller, Get, Put, Body, Param, InternalServerErrorException } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateFoodShopDto } from './dto/update-food-shop.dto'; // Assuming the DTO exists

@Controller()
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

  @Put('/update-food-shop/:food_shop_id')
  async updateFoodShop(
    @Param('food_shop_id') food_shop_id: string,
    @Body() updateFoodShopDto: UpdateFoodShopDto,
  ): Promise<string> {
    try {
      return await this.appService.updateFoodShop(food_shop_id, updateFoodShopDto);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
