import { Request, Response } from 'express';
import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config()

const localDBConnectionDetails = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_FORWARDING_PORT,
};

const pool = new Pool({
    ...localDBConnectionDetails,
    max: 10,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 2000,
});

export const getList = async (request: Request, response: Response) => {
    const userId = request.params.userId;

    pool.query(`
        SELECT
            i.ingredientId AS "ingredientId",
            i.name,
            subQuery.quantity,
            i.unit,
           	subQuery.completed
        FROM
            ingredients i
        INNER JOIN
        (
            SELECT
            unnest(l.list)::JSON->>'ingredientId' AS ingredientId,
            unnest(l.list)::JSON->'quantity' AS quantity,
            unnest(l.list)::JSON->'completed' AS completed
            FROM lists l
            WHERE l.listId = $1
        ) AS subQuery
        ON i.ingredientId::TEXT = subQuery.ingredientId;

    `, [userId],
        (queryError, results) => {
            if (queryError) {
                console.error(`getList, userId: ${userId}`, queryError);
                response.status(500).json({ message: "500 Internal Server Error." });
            } else {
                console.log(`getList, userId: ${userId}`, results);
                response.status(200).json({ message: "Completed Successfully.", data: results.rows });
            }
        },
    );
};

export const putList = async (request: Request, response: Response) => {
    const userId = request.params.userId;
    const data = request.body.list;
    //{
    //    "list": [
    //        {
    //            "ingredientId": 10,
    //            "quantity": 900,
    //            "completed": false
    //        },
    //        {
    //            "ingredientId": 9,
    //            "quantity": 800,
    //            "completed": true
    //        }
    //    ]
    //}
    pool.query(`
        UPDATE lists
        SET list = $1
        WHERE listId = $2;
    `, [data, userId],
        (queryError, results) => {
            if (queryError) {
                console.error(`putList, userId: ${userId}`, queryError);
                response.status(500).json({ message: "500 Internal Server Error." });
            } else {
                console.log(`putList, userId: ${userId}`, results);
                response.status(200).json({ message: "Completed Successfully." });
            }
        },
    );
};

export const getDishes = async (request: Request, response: Response) => {
    const time = request.query.time ?? null;
    const cuisines = request.query.cuisines ?? null;
    const dietRestrictions = request.query.dietRestrictions ?? null;

    pool.query(`
        SELECT
            d.dishId AS "dishId",
            d.title,
            d.picture,
            d.cuisines,
            d.dietRestrictions AS "dietRestrictions",
            d.time,
            u.name,
            u.location,
            u.picture
        FROM dishes d
        INNER JOIN users u ON d.userId = u.userId
        WHERE ($1::integer IS NULL OR d.time <= $1)
        AND ($2::text IS NULL OR ARRAY_TO_STRING(d.cuisines, '') LIKE $2::text)
        AND ($3::text IS NULL OR ARRAY_TO_STRING(d.dietRestrictions, '') LIKE $3::text)
        ORDER BY 1 DESC;
    `, [time, cuisines, dietRestrictions],
    //NOTE: why does $3 work when LIKE instead of NOT LIKE?
    //NOTE: what of multiple cuisines/dietRestrictions?
    //NOTE: wildcard needed?
        (queryError, results) => {
            if (queryError) {
                console.error("getDishes", queryError);
                response.status(500).json({ message: "500 Internal Server Error." });
            } else {
                console.log("getDishes", results);
                response.status(200).json({ message: "Completed Successfully.", data: results.rows });
            }
        },
    );
};

export const getSavedDishes = async (request: Request, response: Response) => {
    const userId = request.params.userId;

    pool.query(`
        SELECT
        	sub.dishId AS "dishId",
        	d.title,
            d.picture,
            d.cuisines,
            d.dietRestrictions AS "dietRestrictions",
            d.time,
            u.name,
            u.location,
            u.picture
        FROM
        (
        	SELECT
        	   	unnest(u.savedDishes) AS dishId
        	FROM users u
        	WHERE u.userid = $1
        ) AS sub
        INNER JOIN dishes d ON sub.dishId = d.dishid
        INNER JOIN users u ON d.userId = u.userId
        ORDER BY 1 DESC;
    `, [userId],
        (queryError, results) => {
            if (queryError) {
                console.error(`getSavedDishes, userId: ${userId}`, queryError);
                response.status(500).json({ message: "500 Internal Server Error." });
            } else {
                console.log(`getSavedDishes, userId: ${userId}`, results);
                response.status(200).json({ message: "Completed Successfully.", data: results.rows });
            }
        },
    );
};

export const putSavedDishes = async (request: Request, response: Response) => {
    const userId = request.params.userId;
    const data = request.body.savedDishes;
    //{
    //    "savedDishes": [1]
    //}
    pool.query(`
        UPDATE users
        SET savedDishes = $1
        WHERE listId = $2;
    `, [data, userId],
        (queryError, results) => {
            if (queryError) {
                console.error(`putSavedDishes, userId: ${userId}`, queryError);
                response.status(500).json({ message: "500 Internal Server Error." });
            } else {
                console.log(`putSavedDishes, userId: ${userId}`, results);
                response.status(200).json({ message: "Completed Successfully." });
            }
        },
    );
};

export const getSearchFilters = async (request: Request, response: Response) => {
    const filter = request.query.filter;

    const getQuery = () => {
        if (filter === "dietRestrictions") {
            return `SELECT
                DISTINCT UNNEST(d.dietRestrictions) AS "dietRestriction"
                FROM dishes d
                ORDER BY 1 ASC;`
        } else if (filter === "cuisines") {
            return `SELECT
                DISTINCT UNNEST(d.cuisines) AS "cuisine"
                FROM dishes d
                ORDER BY 1 ASC;`
        }
    };

    pool.query(getQuery(),
        (queryError, results) => {
            if (queryError) {
                console.error("getSearchFilters", queryError);
                response.status(500).json({ message: "500 Internal Server Error." });
            } else {
                console.log("getSearchFilters", results);
                response.status(200).json({ message: "Completed Successfully.", data: results.rows });
            }
        },
    );
};
