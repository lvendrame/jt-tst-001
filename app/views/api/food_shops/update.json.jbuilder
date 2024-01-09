class FoodShopController < ApplicationController
  def update
    @food_shop = FoodShop.find_by(id: params[:id])
    
    if @food_shop.update(food_shop_params)
      render json: Jbuilder.encode { |json|
        json.status 200
        json.message "Editing completed"
        json.food_shop do
          json.id @food_shop.id
          json.user_id @food_shop.user.id
          json.contract_status @food_shop.contract_status
          json.shop_name @food_shop.shop_name
          json.status @food_shop.status
          json.updated_at @food_shop.updated_at.iso8601
        end
      }
    else
      render json: Jbuilder.encode { |json|
        json.status 500
        json.message "Internal server error"
      }, status: :internal_server_error
    end
  end

  private

  def food_shop_params
    # Assuming there's a method to whitelist parameters for updating a food shop
    params.require(:food_shop).permit(:user_id, :contract_status, :shop_name, :status)
  end
end
