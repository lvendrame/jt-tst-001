import { Injectable } from '@nestjs/common';
import { FoodShop } from './food_shop.entity'; // Assuming the entity exists

@Injectable()
export class AppService {
  async getFoodShopDetails(foodShopId: string): Promise<{ contract_status: string; shop_name: string; status: string; }> {
    // Assuming there's a method in FoodShop entity to find by ID
    const foodShop: FoodShop = await FoodShop.findOne(foodShopId);
    return {
      contract_status: foodShop.contract_status ? 'Active' : 'Inactive',
      shop_name: foodShop.shop_name,
      status: foodShop.status,
    };
  }

  validateShopInformation(shop_name: string, contract_status: string): boolean | string {
    if (typeof shop_name !== 'string' || shop_name.length > 50) {
      return '50 文字以内で入力してください';
    }

    const contractStatusBoolean = contract_status.toLowerCase() === 'yes' ? true : contract_status.toLowerCase() === 'no' ? false : null;
    if (contractStatusBoolean === null) {
      return 'contract_status must be a boolean value (Yes/No)';
    }

    return true;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
