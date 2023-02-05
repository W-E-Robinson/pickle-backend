import express, { Request, Response, Application } from 'express';

const app: Application = express();

const PORT = 8080;

app.get("/", (request: Request, response: Response): void => {
    response.send("Hello Typescript with Node.js!")
});

app.listen(PORT, (): void => {
    console.log(`Server running on port: ${PORT}`);
});
