require 'sidekiq/web'

Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  get '/health' => 'pages#health_check'
  get 'api-docs/v1/swagger.yaml' => 'swagger#yaml'

  # New route from the new code
  get '/api/food_shops/:id/edit_permission', to: 'api/food_shops#check_edit_permission'

  # Existing routes from the existing code
  namespace :api do
    resources :food_shops, only: [] do
      put :update, on: :member
      delete :handle_internal_server_error, on: :collection
    end
  end

  get '/api/internal_server_error' => 'api/food_shops#handle_internal_server_error'
  delete '/api/internal_server_error', to: 'api/food_shops#handle_internal_server_error'
  post '/api/internal_server_error', to: 'api/food_shops#handle_internal_server_error'
end
