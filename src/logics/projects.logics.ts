import { Response, Request } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
  TProject,
  TProjectRequest,
  TProjectResponse,
  TTechnologies,
} from "../interfaces/projects.interfaces";
import { client } from "../database";
import format, { string } from "pg-format";

const createProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: TProjectRequest = req.body;

  const queryString: string = format(
    `
    INSERT INTO
        projects(%I)
    VALUES
        (%L)
    RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: QueryResult<TProject> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const readOneProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryString: string = `
    SELECT
        p."id" "projectId",
        p."name" "projectName", 
        p."description" "projectDescription",
        p."estimatedTime" "projectEstimatedTime",
        p."repository" "projectRepository",
        p."startDate" "projectStartDate",
        p."endDate" "projectEndDate",
        p."developerId" "projectDeveloperId",
        pt."technologyId" "technologyId",
        t."name" "technologyName"
    FROM
        projects p 
    LEFT JOIN
        projects_technologies pt ON p."id" = pt."technologyId" 
    LEFT JOIN
        technologies t ON pt."technologyId" = t."id";
    `;

  const queryResult: QueryResult<TProjectResponse> = await client.query(
    queryString
  );

  return res.json(queryResult.rows);
};

const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const projectData: Partial<TProjectRequest> = req.body;

  const queryString: string = format(
    `
    UPDATE 
        projects
    SET(%I) = ROW(%L)
    WHERE
        id = $1
    RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TProject> = await client.query(queryConfig);
  return res.json(queryResult.rows[0]);
};

const destroyProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE FROM 
        projects
    WHERE 
        id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

const createTechnologies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = req.params.id;
  const date = new Date();
  const technologyId = res.locals.technologyId;

  let queryString: string = `
    INSERT INTO
        projects_technologies ("technologyId", "addedIn", "projectId")
    VALUES
        ($1, $2, $3)
    RETURNING *;
    `;
  let queryConfig: QueryConfig = {
    text: queryString,
    values: [technologyId, date, projectId],
  };

  let queryResult: QueryResult<TProjectResponse> = await client.query(
    queryConfig
  );

  queryString = `
    SELECT
        pt."technologyId",
        t."name" "technologyName",
        p."id" "projectId",
        p."name" "projectName",
        p."description" "projectDescription",
        p."estimatedTime" "projectEstimatedTime",
        p."repository" "projectRepository",
        p."startDate" "projectStartDate",
        p."endDate" "projectEndDate"
    FROM
        projects p
    LEFT JOIN
        projects_technologies pt on p.id = pt."projectId"
    LEFT JOIN
        technologies t on t.id = pt."technologyId";
   `;
  queryResult = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const destroyTechnology = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const technologyId = res.locals.technologyId;
  const projectId: Number = parseInt(req.params.id);

  const queryString: string = `
    DELETE FROM
        projects_technologies
    WHERE
        "technologyId" = $1 and "projectId" = $2
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [technologyId, projectId],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

export {
  createProjects,
  readOneProject,
  updateProject,
  destroyProject,
  createTechnologies,
  destroyTechnology,
};
