import express, { Application, json } from "express";
import "dotenv/config";

const app: Application = express();

app.use(json());

app.post("/developers");
app.get("/developers/:id");
app.patch("/developers/:id");
app.delete("/developers/:id");
app.post("/developers/:id/infos");

export default app;
