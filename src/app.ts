import express, { Application, json } from "express";
import "dotenv/config";
import {
  verifyEmailExists,
  verifyIdExist,
  verifyInfoExists,
  verifyOS,
} from "./middlewares/developers.middleware";
import {
  createDeveloper,
  createDeveloperInformations,
  deleteDeveloper,
  getDevelopers,
  updateDeveloper,
} from "./logics/developers.logic";

const app: Application = express();

app.use(json());

app.post("/developers", verifyEmailExists, createDeveloper);
app.get("/developers/:id", verifyIdExist, getDevelopers);
app.patch("/developers/:id", verifyIdExist, verifyEmailExists, updateDeveloper);
app.delete("/developers/:id", verifyIdExist, deleteDeveloper);
app.post(
  "/developers/:id/infos",
  verifyIdExist,
  verifyInfoExists,
  verifyOS,
  createDeveloperInformations
);

app.post("/projects");
app.get("/projects/:id");
app.patch("/projects/:id");
app.delete("/projects/:id");
app.post("/projects/:id");
app.delete("/projects/:id/technologies/:name");

export default app;
