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
import {
  createProject,
  deleteProject,
  deleteTechInProject,
  getProjects,
  postTechInProject,
  updateProject,
} from "./logics/projects.logics";
import {
  ensureTechExistInProject,
  verifyDeveloper,
  verifyProject,
  verifyTechFromBody,
  verifyTechFromParams,
  verifyTechInProject,
} from "./middlewares/projects.middlewares";

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

app.post("/projects", verifyDeveloper, createProject);
app.get("/projects/:id", verifyProject, getProjects);
app.patch("/projects/:id", verifyProject, verifyDeveloper, updateProject);
app.delete("/projects/:id", verifyProject, deleteProject);
app.post(
  "/projects/:id/technologies",
  verifyProject,
  verifyTechFromBody,
  verifyTechInProject,
  postTechInProject
);
app.delete(
  "/projects/:id/technologies/:name",
  verifyProject,
  verifyTechFromParams,
  ensureTechExistInProject,
  deleteTechInProject
);

export default app;
