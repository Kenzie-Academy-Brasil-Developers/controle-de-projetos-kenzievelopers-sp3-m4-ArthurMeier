import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { IProject } from "../intefaces/project.intefaces";
import { IDeveloper } from "../intefaces/developer.interfaces";

const verifyDeveloper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = parseInt(req.body.developerId);

  const queryTemplate: string = `
    SELECT
        *
    FROM
        developers
    WHERE
        id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  const foundDeveloper: IDeveloper = queryResult.rows[0];

  if (!foundDeveloper) {
    return res.status(404).json({ message: "Developer not found." });
  }

  return next();
};

const verifyProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT
          *
      FROM
          projects
      WHERE
          id=$1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProject> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Project not found." });
  }

  return next();
};

export { verifyDeveloper, verifyProject };
