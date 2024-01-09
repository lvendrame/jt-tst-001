class Api::FoodShopsController < ApplicationController
  before_action :doorkeeper_authorize!, only: [:check_edit_permission, :validate]
  before_action :validate_user_membership, only: [:update]
  before_action :validate_food_shop_id, only: [:editable_status, :check_edit_permission, :validate]
  before_action :authenticate_user!, only: [:update, :validate]
  before_action :set_food_shop, only: [:update, :editable_status, :validate]
  rescue_from StandardError, with: :handle_internal_server_error

  # GET /api/food_shops/:id/edit_permission
  def check_edit_permission
    return unless current_resource_owner.is_member?
    food_shop_service = FoodShopService.new
    result = food_shop_service.check_edit_permission(current_resource_owner.id, params[:id])

    if result == true
      render json: { status: 200, permission: true }, status: :ok
    elsif result[:error]
      render json: { error: result[:error] }, status: error_status(result[:error])
    end
  end

  # GET /api/food_shops/:id/editable_status
  def editable_status
    food_shop_service = FoodShopService.new
    result = food_shop_service.check_editable_status(params[:id], @food_shop.status)

    if result == true
      render json: { status: 200, editable: true }, status: :ok
    else
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

        unless params[:id].is_a?(Numeric)
          raise ArgumentError, 'Invalid food shop ID format.'
        end

        if params[:shop_name].length > 50
          raise ArgumentError, 'Please enter within 50 characters.'
        end

        raise ArgumentError, 'Invalid contract status format.' unless contract_status.in?([true, false])

        raise ArgumentError, 'Invalid status value.' unless %w[Publish Pending].include?(status)

        if @food_shop.user.is_member?
          @food_shop.update!(
            contract_status: contract_status,
            shop_name: params[:shop_name],
            status: status
          )
        end
      end
      render json: { status: 200, message: 'Food shop information updated successfully.' }, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Food shop not found' }, status: :not_found
    rescue ArgumentError => e
      render json: { error: e.message }, status: :unprocessable_entity
    rescue Pundit::NotAuthorizedError
      render json: { error: 'User does not have permission to update the food shop.' }, status: :forbidden
    end
  end

  # POST /api/food_shops/:id/validate
  def validate
    food_shop = FoodShop.new(food_shop_params)
    if food_shop.valid?
      render json: { status: 200, message: "Validation successful." }, status: :ok
    else
      render json: { error: food_shop.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  rescue ActionController::ParameterMissing => e
    render json: { error: e.message }, status: :bad_request
  end

  private

  def validate_user_membership
    unless current_resource_owner.is_member?
      render json: { error: 'User is not a member of FfF.' }, status: :forbidden
      return
    end
  end

  def food_shop_params
    params.require(:food_shop).permit(:contract_status, :shop_name, :status)
  end

  def set_food_shop
    @food_shop = FoodShop.find_by(id: params[:food_shop_id] || params[:id])
    render json: { error: 'Food shop not found' }, status: :not_found unless @food_shop
  end

  def validate_food_shop_id
    unless params[:id].match?(/\A\d+\z/)
      render json: { error: 'Invalid food shop ID format.' }, status: :bad_request
    end
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
    Rails.logger.error "Internal Server Error: #{exception.message}"
  end
end
