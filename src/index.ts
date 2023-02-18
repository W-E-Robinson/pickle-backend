import express, { Request, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
    getList,
    //putList,
    getDishes,
} from "./endpoints";

const app: Application = express();

dotenv.config()
app.use(cors<Request>())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.BACKEND_PORT;

app.get("/lists/:userId", getList);
//app.put("/lists", putList);
app.get("/dishes", getDishes);

app.listen(PORT, (): void => {
    console.log(`Server running on port: ${PORT}`);
});

