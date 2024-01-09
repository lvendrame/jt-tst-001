
import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

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
}
