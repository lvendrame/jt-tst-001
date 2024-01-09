import { Injectable } from '@nestjs/common';
import { FoodShop } from './food_shop.entity'; // Assuming the entity exists

enum FoodShopStatus {
  Publish = 'Publish',
  Pending = 'Pending',
}

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

  async updateFoodShop(food_shop_id: string, user_id: string, contract_status: string, shop_name: string, status: FoodShopStatus): Promise<string> {
    try {
      const foodShop = await FoodShop.findOne({ where: { id: food_shop_id, user_id: user_id } });
      if (!foodShop) {
        return 'Food shop not found';
      }

      const validationResult = this.validateShopInformation(shop_name, contract_status);
      if (validationResult !== true) {
        return validationResult as string;
      }

      foodShop.contract_status = contract_status.toLowerCase() === 'yes';
      foodShop.shop_name = shop_name;
      foodShop.status = status;

      await FoodShop.save(foodShop);
      return 'Editing completed';
    } catch (error) {
      return 'Internal server error';
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
