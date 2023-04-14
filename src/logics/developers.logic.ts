import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
  IDeveloper,
  CreateDeveloper,
  CreateDeveloperInfo,
} from "../intefaces/developer.interfaces";
import { client } from "../database";
import format from "pg-format";

const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: CreateDeveloper = req.body;

  const queryString: string = format(
    `
      INSERT INTO
          developers
          (%I)
          VALUES
          (%L)
          RETURNING *;
      `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResult: QueryResult<CreateDeveloper> = await client.query(
    queryString
  );

  return res.status(201).json(queryResult.rows[0]);
};

const getDevelopers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryString: string = `
        SELECT
            de."id" "developerId",
            de."name",
            de."email",
            di."developerSince",
            di."preferredOS"
        FROM 
            developers de
        LEFT JOIN
            developer_infos di ON de."id" = di."developerId";
    `;

  const queryResult: QueryResult<IDeveloper> = await client.query(queryString);

  return res.json(queryResult.rows);
};

const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: Partial<CreateDeveloper> = req.body;
  const id: number = parseInt(req.params.id);

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

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteDeveloper = async (
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

const createDeveloperInformations = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerInformationsData: CreateDeveloperInfo = req.body;
  developerInformationsData.developerId = parseInt(req.params.id);

  const queryString: string = format(
    `
        INSERT INTO
            developer_infos(%I)
        VALUES
            (%L)
        RETURNING *;
        `,
    Object.keys(developerInformationsData),
    Object.values(developerInformationsData)
  );

  const queryResult: QueryResult<CreateDeveloperInfo> = await client.query(
    queryString
  );

  return res.status(201).json(queryResult.rows[0]);
};

export {
  createDeveloper,
  getDevelopers,
  updateDeveloper,
  deleteDeveloper,
  createDeveloperInformations,
};
