import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const ensureDeveloperExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: Number = parseInt(req.params.id);

  if (req.route.path === "/projects" && req.method === "POST") {
    id = req.body.developerId;
  }

  if (req.route.path === "/projects/:id" && req.method === "PATCH") {
    id = req.body.developerId;
  }

  const queryString: string = `
  SELECT
    *
  FROM
    developers
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
      message: "Developer not found.",
    });
  }

  res.locals.developer = queryResult.rows[0];

  return next();
};

const ensureDeveloperEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const email: string = req.body.email;
  const queryString: string = `
    SELECT
      *
    FROM
      developers
    WHERE
      email = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount !== 0) {
    return res.status(409).json({
      message: "Email already exists.",
    });
  }

  res.locals.developer = queryResult.rows[0];

  return next();
};

const ensureDeveloperInfosExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: Number = parseInt(req.params.id);

  const queryString: string = `
  SELECT
    *
  FROM
    developer_infos
  WHERE
    id = $1
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount !== 0) {
    return res.status(409).json({
      message: "Developer infos already exists.",
    });
  }

  res.locals.developer = queryResult.rows[0];

  return next();
};

export {
  ensureDeveloperExists,
  ensureDeveloperEmailExists,
  ensureDeveloperInfosExists,
};
