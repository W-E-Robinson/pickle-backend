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
            i.ingredientId,
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

//app.put("/lists", (request: Request, response: Response): void => {
//    response.send(`PUT /lists called with body: ${request.body}`);
//});
//
//app.get("/dishes", (request: Request, response: Response): void => {
//    response.send(`GET /dishes called with queries: ${request.query}`);
//});
//
//app.get("/savedDishes/:userId", (request: Request, response: Response): void => {
//    response.send(`GET /savedDishes/${request.params.userId}`);
//});
//
//app.put("/savedDishes", (request: Request, response: Response): void => {
//    response.send(`PUT /savedDishes called with body: ${request.body}`);
//});
//
//app.get("/searchFilters", (request: Request, response: Response): void => {
//    response.send(`GET /searchFilters called with queries: ${request.query}`);
//});
