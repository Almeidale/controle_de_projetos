import express, { Application } from "express";
import "dotenv/config";
import {
  createProjects,
  createTechnologies,
  destroyProject,
  destroyTechnology,
  readOneProject,
  updateProject,
} from "./logics/projects.logics";
import {
  createDeveloper,
  readOneDeveloper,
  createDeveloperInfos,
  updateDeveloper,
  destroyDeveloper,
} from "./logics/developers.logics";
import {
  ensureDeveloperEmailExists,
  ensureDeveloperExists,
  ensureDeveloperInfosExists,
} from "./middlewares/developers.middlewares";
import {
  ensureNoDuplicateTechnology,
  ensureProjectsExists,
  ensureTechnologyExists,
} from "./middlewares/projects.middlewares";

const app: Application = express();
app.use(express.json());

// Devs
app.post("/developers", ensureDeveloperEmailExists, createDeveloper);
app.get("/developers/:id", ensureDeveloperExists, readOneDeveloper);
app.patch(
  "/developers/:id",
  ensureDeveloperExists,
  ensureDeveloperEmailExists,
  updateDeveloper
);
app.delete("/developers/:id", ensureDeveloperExists, destroyDeveloper);
app.post(
  "/developers/:id/infos",
  ensureDeveloperExists,
  ensureDeveloperInfosExists,
  createDeveloperInfos
);

// Projects
app.post("/projects", ensureDeveloperExists, createProjects);
app.get("/projects/:id", ensureProjectsExists, readOneProject);

app.patch(
  "/projects/:id",
  ensureDeveloperExists,
  ensureProjectsExists,
  updateProject
);
app.delete("/projects/:id", ensureProjectsExists, destroyProject);
app.post(
  "/projects/:id/technologies",
  ensureProjectsExists,
  ensureTechnologyExists,
  ensureNoDuplicateTechnology,
  createTechnologies
);
app.delete(
  "/projects/:id/technologies/:name",
  ensureProjectsExists,
  ensureTechnologyExists,
  ensureNoDuplicateTechnology,
  destroyTechnology
);

export default app;
