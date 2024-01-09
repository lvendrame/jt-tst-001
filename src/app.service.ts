import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
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
