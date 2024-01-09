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

end
