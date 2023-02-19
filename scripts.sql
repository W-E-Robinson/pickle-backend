-- PUT /lists body={ ingredientId: number, quantity: number, completed: boolean }[]
-- DONE
UPDATE lists
SET list = ARRAY['{"ingredientId": 2, "quantity": 9999, "completed": true}', '{"ingredientId": 1, "quantity": 6, "completed": false}']::JSON[]
WHERE listId = 1;

-- PUT /savedDishes body={ dishId: number, action: "removal" | "addition" } = same as other PUT incase deletion
-- DONE
UPDATE users
SET savedDishes = '{1,2,4,100}'
WHERE userid = 1;
