import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodShop } from './entities/food-shop.entity'; // Assuming the entity exists

enum FoodShopStatus {
  Publish = 'Publish',
  Pending = 'Pending',
}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(FoodShop)
    private foodShopRepository: Repository<FoodShop>,
  ) {}

  async getFoodShopDetails(foodShopId: string): Promise<{ contract_status: string; shop_name: string; status: string; }> {
    const foodShop = await this.foodShopRepository.findOne(foodShopId);
    return {
      contract_status: foodShop.contract_status ? 'Active' : 'Inactive',
      shop_name: foodShop.shop_name,
      status: foodShop.status,
    };
  }

  validateShopInformation(shopName: string, contractStatus: string): boolean | string {
    if (typeof shopName !== 'string' || shopName.length === 0 || shopName.length > 50) {
      return '50 文字以内で入力してください';
    }

    const contractStatusBoolean = contractStatus.toLowerCase() === 'yes' ? true : contractStatus.toLowerCase() === 'no' ? false : null;
    if (contractStatusBoolean === null) {
      return 'contract_status must be a boolean value (Yes/No)';
    }

    return true;
  }

  async handleInternalServerError(foodShopId: string): Promise<void> {
    if (isNaN(Number(foodShopId))) {
      throw new HttpException('Invalid food shop ID format.', HttpStatus.BAD_REQUEST);
    }
    try {
      const foodShop = await this.foodShopRepository.findOne(foodShopId);
      if (!foodShop) {
        throw new HttpException('Food shop not found.', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkFoodShopEditableStatus(foodShopId: string): Promise<void> {
    const foodShop = await this.foodShopRepository.findOne(foodShopId);
    if (!foodShop || foodShop.status !== FoodShopStatus.Pending) {
      throw new HttpException(
        "This shop can't be edited",
        HttpStatus.BAD_REQUEST,
      );
    }
    // If the status is "Pending", the method ends here, indicating the shop is editable
  }

  async checkEditPermission(userId: string, foodShopId: string): Promise<boolean> {
    if (isNaN(Number(foodShopId))) {
      throw new BadRequestException('Wrong format.');
    }

    const foodShop = await this.foodShopRepository.findOne(foodShopId);
    if (!foodShop || foodShop.status !== FoodShopStatus.Pending) {
      throw new HttpException("This shop can't be edited", HttpStatus.FORBIDDEN);
    }
    if (foodShop.user_id.toString() !== userId) {
      throw new HttpException("Insufficient permissions to edit this shop", HttpStatus.FORBIDDEN);
    }
    return true;
  }

  async updateFoodShop(
    foodShopId: string,
    userId: string,
    contractStatus: string,
    shopName: string,
    status: FoodShopStatus
  ): Promise<string> {
    try {
      const foodShop = await this.foodShopRepository.findOne({
        where: {
          id: foodShopId,
          user_id: userId,
        },
      });
      if (!foodShop) {
        return 'Food shop not found';
      }

      const validationResult = this.validateShopInformation(shopName, contractStatus);
      if (validationResult !== true) {
        return validationResult as string;
      }

      foodShop.contract_status = contractStatus.toLowerCase() === 'yes';
      foodShop.shop_name = shopName;
      foodShop.status = status;

      await this.foodShopRepository.save(foodShop);
      return 'Editing completed';
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
