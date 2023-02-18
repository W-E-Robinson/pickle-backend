import express, { Request, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
    getList,
    getDishes,
    getSavedDishes,
    getSearchFilters,
} from "./endpoints";

const app: Application = express();

dotenv.config()
app.use(cors<Request>())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.BACKEND_PORT;

app.get("/lists/:userId", getList);
//PUT /lists body={ ingredientId: number, quantity: number, completed: boolean }[]
app.get("/dishes", getDishes);
//GET /dishes?cuisine=___&diet=___&time=___
app.get("/savedDishes/:userId", getSavedDishes);
//PUT /savedDishes body={ dishId: number, action: "removal" | "addition" } = same as other PUT incase deletion
//GET /searchFilters?filter=cuisines
app.get("/searchFilters", getSearchFilters);

app.listen(PORT, (): void => {
    console.log(`Server running on port: ${PORT}`);
});

