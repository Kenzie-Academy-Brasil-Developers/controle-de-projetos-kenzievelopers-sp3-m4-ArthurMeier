import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { IDeveloper, IDeveloperInfo } from "../intefaces/developer.interfaces";
import { client } from "../database";

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
        developers
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

const verifyInfoExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT
          *
      FROM
          developer_infos
      WHERE
          "developerId"=$1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloperInfo> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount === 0) {
    return next();
  }

  return res.status(409).json({ message: "Developer infos already exists." });
};

const verifyOS = async (req: Request, res: Response, next: NextFunction) => {
  const { preferredOS } = req.body;

  if (
    preferredOS == "Windows" ||
    preferredOS == "Linux" ||
    preferredOS == "MacOS"
  ) {
    return next();
  }

  return res.status(400).json({
    message: "Invalid OS option.",
    options: ["Windows", "Linux", "MacOS"],
  });
};

export { verifyEmailExists, verifyIdExist, verifyInfoExists, verifyOS };
