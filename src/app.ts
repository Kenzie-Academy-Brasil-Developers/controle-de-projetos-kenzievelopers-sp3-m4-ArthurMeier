import express, { Application, json } from "express";
import "dotenv/config";
import { verifyEmailExists, verifyIdExist } from "./middleware";
import { createDeveloper, getDevelopers } from "./logic";

const app: Application = express();

app.use(json());

app.post("/developers", verifyEmailExists, createDeveloper);
app.get("/developers/:id", verifyIdExist, getDevelopers);
app.patch("/developers/:id", verifyEmailExists);
app.delete("/developers/:id");
app.post("/developers/:id/infos");

export default app;
