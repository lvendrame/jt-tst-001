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
      # The delete route for handle_internal_server_error is already defined below, so we don't need to duplicate it here.
    end
  end

  # The specific routes for handle_internal_server_error are defined before the catch-all to ensure they are matched first.
  get '/api/internal_server_error' => 'api/food_shops#handle_internal_server_error'
  post '/api/internal_server_error', to: 'api/food_shops#handle_internal_server_error'
  delete '/api/internal_server_error', to: 'api/food_shops#handle_internal_server_error'
  
  # The match route is a catch-all for errors, so it should be at the end of the file to avoid catching other routes.
  match '/api/*path', to: 'api/food_shops#handle_internal_server_error', via: :all
end
