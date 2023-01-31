-- GET /lists/{userId}
-- DONE
SELECT
    i.ingredientId,
	i.name,
	subQuery.quantity,
	i.unit
FROM
ingredients i
INNER JOIN
(
	SELECT
	    unnest(l.list)::JSON->>'itemId' AS itemId,
	    unnest(l.list)::JSON->'quantity' AS quantity
	FROM lists l
	WHERE l.listId = {userId}
) AS subQuery
ON i.ingredientId::TEXT = subQuery.itemId;

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
where d.time < 150
and array_to_string(d.cuisines, '') like '%American%'
and array_to_string(d.dietrestrictions, '') not like '%Vegan%'
--multiple choices though? -- do in js portion in backend?
ORDER BY 1 DESC;

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
