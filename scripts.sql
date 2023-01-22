-- GET /lists/{userId}

-- PUT /lists body={ itemId: number, ingredient: string, quantity: number, completed: boolean }

-- GET /dishes
SELECT
    d.dishId,
    d.title,
    d.picture,
    d.cuisines,
    d.dietRestrictions,
    d.time,
    u.name,
    u.location,
    u.picture
FROM dishes d
INNER JOIN users u ON d.userId = u.userId
ORDER BY 1 DESC;
-- GET /dishes?cuisine=___&diet=___&time=___

-- GET /savedDishes/{userId}

-- PUT /savedDishes body={ dishId: number }

-- GET /searchFilters?filter=cuisine

-- GET /searchFilters?filter=diet

-- GET /searchFilters?filter=time

