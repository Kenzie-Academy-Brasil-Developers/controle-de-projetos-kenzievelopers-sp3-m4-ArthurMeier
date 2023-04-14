import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { IDeveloper, CreateDeveloper } from "./interfaces";
import { client } from "./database";
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

export { createDeveloper, getDevelopers };
