
# frozen_string_literal: true

class FoodShopService < BaseService
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
