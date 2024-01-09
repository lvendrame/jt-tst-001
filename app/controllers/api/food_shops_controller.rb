class Api::FoodShopsController < ApplicationController
  before_action :doorkeeper_authorize!
  before_action :authenticate_user!, only: [:update]
  before_action :set_food_shop, only: [:update]
  before_action :validate_food_shop_id, only: [:check_edit_permission]
  rescue_from StandardError, with: :handle_internal_server_error

  # GET /api/food_shops/:id/edit_permission
  def check_edit_permission
    food_shop_service = FoodShopService.new
    result = food_shop_service.check_edit_permission(current_resource_owner.id, params[:id])

    if result == true
      render json: { status: 200, permission: true }, status: :ok
    elsif result[:error]
      render json: { error: result[:error] }, status: error_status(result[:error])
    end
  end

  def update
    # Validate the user's permission to update the food shop
    if @food_shop.status != 'Pending'
      render json: { error: 'Insufficient permissions to edit this shop' }, status: :forbidden
      return
    end

    begin
      ActiveRecord::Base.transaction do
        contract_status = ActiveRecord::Type::Boolean.new.cast(params[:contract_status])
        status = params[:status].capitalize

        authorize @food_shop, policy_class: FoodShopPolicy

        unless params[:id].match?(/\A\d+\z/)
          raise ArgumentError, 'Invalid food shop ID format.'
        end

        if params[:shop_name].length > 50 # This validation is already handled by the model
          raise ArgumentError, 'Please enter within 50 characters.'
        end

        raise ArgumentError, 'Invalid contract status format.' unless [true, false].include?(contract_status)

        raise ArgumentError, 'Invalid status value.' unless %w[Publish Pending].include?(status)

        @food_shop.update!(
          contract_status: contract_status, # This validation is already handled by the model
          shop_name: params[:shop_name],
          status: status
        )
      end
      render json: { message: 'Editing completed' }, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Food shop not found' }, status: :not_found
    rescue ArgumentError => e # This block is handling validation errors
      render json: { error: e.message }, status: :unprocessable_entity
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.record.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def set_food_shop # This method is setting the food shop instance variable
    @food_shop = FoodShop.find(params[:food_shop_id])
  end

  def validate_food_shop_id
    unless params[:id].match?(/\A\d+\z/)
      render json: { error: 'Invalid food shop ID format.' }, status: :bad_request
    end # This method is validating the food shop ID format
  end

  def error_status(error_message)
    case error_message
    when 'Food shop not found' then :not_found
    when 'This shop can\'t be edited', 'Insufficient permissions to edit this shop' then :forbidden
    else :internal_server_error
    end
  end

  def handle_internal_server_error(exception)
    log_error(exception)
    render json: {
      status: 500,
      error: "Internal server error"
    }, status: :internal_server_error
  end

  def log_error(exception)
    Rails.logger.error "Internal Server Error: #{exception.message}" # Log the error
  end
end
