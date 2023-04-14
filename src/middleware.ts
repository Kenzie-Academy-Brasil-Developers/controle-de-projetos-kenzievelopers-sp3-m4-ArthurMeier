import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { IDeveloper } from "./interfaces";
import { client } from "./database";

const verifyEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const queryTemplate: string = `
    SELECT
        email
    FROM
        movies
    WHERE
        email = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [email],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  const foundEmail: IDeveloper = queryResult.rows[0];

  if (foundEmail) {
    return res.status(409).json({
      message: "Email already exists.",
    });
  }

  return next();
};

const verifyIdExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT
          *
      FROM
          developers
      WHERE
          id=$1;
      `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Developer not found." });
  }

  return next();
};

export { verifyEmailExists, verifyIdExist };
