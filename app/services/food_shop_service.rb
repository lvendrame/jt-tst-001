
# frozen_string_literal: true

class FoodShopService < BaseService
  def check_edit_permission(user_id: Integer, food_shop_id: Integer)
    food_shop = FoodShop.find_by(id: food_shop_id)

    return OpenStruct.new(success?: false, error: 'Food shop not found', status: 404, message: 'Food shop not found') if food_shop.nil?
    return OpenStruct.new(success?: false, error: 'This shop can\'t be edited', status: 403, message: 'This shop can\'t be edited') unless food_shop.status == 'pending'
    return OpenStruct.new(success?: false, error: 'User does not have permission to edit this shop', status: 403, message: 'User does not have permission to edit this shop') if food_shop.user_id != user_id

    OpenStruct.new(success?: true, error: nil, status: 200, message: 'User has permission to edit the shop')
  rescue ActiveRecord::RecordNotFound
    OpenStruct.new(success?: false, error: 'Food shop not found', status: 404, message: 'Food shop not found')
  rescue StandardError => e
    Rails.logger.error "FoodShopService#check_edit_permission: #{e.message}"
    OpenStruct.new(success?: false, error: 'An unexpected error occurred', status: 500, message: 'An unexpected error occurred')
  end

  def check_editable_status(id, status)
    food_shop = FoodShop.find_by(id: id)

    return { error: 'Food shop not found' } if food_shop.nil?
    return { error: 'This shop can\'t be edited' } unless status == 'pending'

    true
  rescue ActiveRecord::RecordNotFound
    { error: 'Food shop not found' }
  rescue StandardError => e
    Rails.logger.error "FoodShopService#check_editable_status: #{e.message}"
    { error: 'An unexpected error occurred' }
  end
end

# Note: BaseService is assumed to be present in the application as per the instructions.
# The FoodShop and User models are assumed to be correctly related as per the ERD.
# Proper error handling and logging are implemented as per the example service file.
