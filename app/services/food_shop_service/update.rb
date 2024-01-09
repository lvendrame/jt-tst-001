class FoodShopService::Update < BaseService
  class Update < BaseService
    def call(food_shop_id, contract_status, shop_name, status)
      ActiveRecord::Base.transaction do
        food_shop = FoodShop.find_by(id: food_shop_id)
        raise ActiveRecord::RecordNotFound, "FoodShop not found" unless food_shop

        unless [true, false].include?(contract_status)
          raise ArgumentError, "contract_status must be a boolean"
        end

        unless ['Publish', 'Pending'].include?(status)
          raise ArgumentError, "status must be either 'Publish' or 'Pending'"
        end

        food_shop.update!(
          contract_status: contract_status,
          shop_name: shop_name,
          status: status
        )
      end
      "Editing completed"
    rescue => e
      ActiveRecord::Rollback
      log_error(e)
      OpenStruct.new(success?: false, error: e.message).to_h
    end
  end
end

# Import BaseService
require_relative '../base_service.rb'
