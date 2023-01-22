-- GET /lists/{userId}
-- TO DO
SELECT
    l.listId,
    l.list
FROM lists l
WHERE l.listId = {listId};

-- PUT /lists body={ itemId: number, ingredient: string, quantity: number, completed: boolean }[]
-- TO DO

-- GET /dishes
-- DONE
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
-- TO DO

-- GET /savedDishes/{userId}
-- DONE
SELECT
	sub.dishId,
	d.title,
    d.picture,
    d.cuisines,
    d.dietRestrictions,
    d.time,
    u.name,
    u.location,
    u.picture
FROM
(
	SELECT
	   	unnest(u.savedDishes) AS dishId
	FROM users u
	WHERE u.userid = {userId}
) AS sub
INNER JOIN dishes d ON sub.dishId = d.dishid
INNER JOIN users u ON d.userId = u.userId
ORDER BY 1 DESC;

-- PATCH /savedDishes body={ dishId: number, action: "removal" | "addition" }
-- TO DO

-- GET /searchFilters?filter=cuisines
-- DONE
SELECT
    DISTINCT UNNEST(d.cuisines)
FROM dishes d
ORDER BY 1 ASC;

-- GET /searchFilters?filter=diets
-- DONE
SELECT
    DISTINCT UNNEST(d.dietRestrictions)
FROM dishes d
ORDER BY 1 ASC;
