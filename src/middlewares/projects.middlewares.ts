import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { TTechnologies } from "../interfaces/projects.interfaces";

const ensureProjectsExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: Number = parseInt(req.params.id);

  const queryString: string = `
    SELECT
      *
    FROM
      projects
    WHERE
      id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  res.locals.projects = queryResult.rows[0];

  return next();
};

const ensureTechnologyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let technologyName = req.body.name;

  if (
    req.route.path === "/projects/:id/technologies/:name" &&
    req.method === "DELETE"
  ) {
    technologyName = req.params.name;
  }

  const queryString: string = `
  SELECT 
      "id"
  FROM
      technologies
  WHERE
     "name" = $1

  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [technologyName],
  };

  let queryResult: QueryResult<TTechnologies> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.technologyId = queryResult.rows[0].id;
  return next();
};

const ensureNoDuplicateTechnology = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const technologyId = res.locals.technologyId;
  const projectId = req.params.id;

  const queryString: string = `
    SELECT 
        *
    FROM
        projects_technologies
    WHERE
        "technologyId" = $1 and "projectId" = $2
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [technologyId, projectId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  console.log(queryResult.rowCount);

  if (
    req.route.path === "/projects/:id/technologies/:name" &&
    req.method === "DELETE"
  ) {
    if (queryResult.rowCount === 0) {
      return res.status(400).json({
        message: "Technology not related to the project.",
      });
    } else {
      return next();
    }
  }

  if (queryResult.rowCount >= 1) {
    return res.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  return next();
};

export {
  ensureProjectsExists,
  ensureTechnologyExists,
  ensureNoDuplicateTechnology,
};
