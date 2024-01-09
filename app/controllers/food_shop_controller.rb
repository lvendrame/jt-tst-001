
class FoodShopController < ApplicationController
  before_action :authenticate_user, :check_membership, only: [:update]

  def update
    @food_shop = FoodShop.find(params[:id])
    
    if @food_shop.update(food_shop_params)
      render json: Jbuilder.encode { |json|
        json.status 200
        json.message "Editing completed"
        json.food_shop do
          json.id @food_shop.id
          json.user_id @food_shop.user_id
          json.contract_status @food_shop.contract_status
          json.shop_name @food_shop.shop_name
          json.status @food_shop.status
          json.updated_at @food_shop.updated_at.iso8601
        end
      }
    else
      render json: Jbuilder.encode { |json|
        json.status 422
        json.errors @food_shop.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def authenticate_user
    # Assuming there's a method to authenticate the user
    render json: { status: 401, message: "Unauthorized" }, status: :unauthorized unless current_user
  end

  def check_membership
    # Assuming there's a method to check if the current user is a member of FfF
    render json: { status: 401, message: "Unauthorized" }, status: :unauthorized unless current_user.is_member
  end

  def food_shop_params
    # Assuming there's a method to whitelist parameters for updating a food shop
    params.require(:food_shop).permit(:user_id, :contract_status, :shop_name, :status)
  end
end
