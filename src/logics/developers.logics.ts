import { Response, Request, query } from "express";
import {
  TDedeveloper,
  TDedeveloperRequest,
  TDeveloperInfos,
  TDeveloperInfosRequest,
  TDeveloperResponse,
} from "../interfaces/developers.interfaces";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import format from "pg-format";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: TDedeveloperRequest = req.body;

  const queryString: string = format(
    `
        INSERT INTO
            developers(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResult: QueryResult<TDedeveloper> = await client.query(
    queryString
  );
  return res.status(201).json(queryResult.rows[0]);
};

const readOneDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryString: string = `
        SELECT
            d."id" "developerId",
            d."name" "developerName",
            d."email" "developerEmail",
            di."developerSince" "developerInfoDeveloperSince",
            di."preferredOS" "developerInfoPreferredOS"
        FROM
          developers d
        LEFT JOIN
        developer_infos di ON d."id" = di."developerId";
    `;

  const queryResult: QueryResult<TDeveloperResponse> = await client.query(
    queryString
  );

  return res.json(queryResult.rows[0]);
};

const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const developerData: Partial<TDedeveloperRequest> = req.body;

  const queryString: string = format(
    `
    UPDATE 
        developers
    SET(%I) = ROW(%L)
    WHERE
        id = $1
    RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDedeveloper> = await client.query(
    queryConfig
  );
  return res.json(queryResult.rows[0]);
};

const destroyDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE FROM 
        developers
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

const createDeveloperInfos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerInfosData: TDeveloperInfosRequest = req.body;
  developerInfosData.developerId = parseInt(req.params.id);
  const { preferredOS } = developerInfosData;

  enum OS {
    win = "Windows",
    lin = "Linux",
    mac = "MacOS",
  }

  if (
    preferredOS !== OS.lin &&
    preferredOS !== OS.win &&
    preferredOS !== OS.mac
  ) {
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  const queryString: string = format(
    `
        INSERT INTO
            developer_infos(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(developerInfosData),
    Object.values(developerInfosData)
  );

  const queryResult: QueryResult<TDeveloperInfos> = await client.query(
    queryString
  );

  return res.status(201).json(queryResult.rows[0]);
};

export {
  createDeveloper,
  readOneDeveloper,
  updateDeveloper,
  destroyDeveloper,
  createDeveloperInfos,
};
