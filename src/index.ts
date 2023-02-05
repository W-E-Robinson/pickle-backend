import express, { Request, Response, Application } from 'express';

const app: Application = express();

const PORT = 8080;

app.get("/lists/:userId", (request: Request, response: Response): void => {
    response.send(`GET /lists/${request.params.userId} called`);
});

app.put("/lists", (request: Request, response: Response): void => {
    response.send(`PUT /lists called with body: ${request.body}`);
});

app.get("/dishes", (request: Request, response: Response): void => {
    response.send(`GET /dishes called with queries: ${request.query}`);
});

app.get("/savedDishes/:userId", (request: Request, response: Response): void => {
    response.send(`GET /savedDishes/${request.params.userId}`);
});

app.put("/savedDishes", (request: Request, response: Response): void => {
    response.send(`PUT /savedDishes called with body: ${request.body}`);
});

app.get("/searchFilters", (request: Request, response: Response): void => {
    response.send(`GET /searchFilters called with queries: ${request.query}`);
});

app.listen(PORT, (): void => {
    console.log(`Server running on port: ${PORT}`);
});
