import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import format from "pg-format";
import { CreateProject, IProject } from "../intefaces/project.intefaces";

const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: IProject = req.body;

  const queryString: string = format(
    `
    INSERT INTO
        projects
            (%I)
        VALUES
            (%L)
    RETURNING *;    
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );
  const QueryResult: QueryResult<CreateProject> = await client.query(
    queryString
  );

  return res.status(201).json(QueryResult.rows[0]);
};

const getProjects = async (req: Request, res: Response): Promise<Response> => {
  const queryString: string = `
        SELECT
            pj."projectId",
            pj."projectName",
            pj."projectDescription",
            pj."projectEstimatedTime",
            pj."projectRepository"
            pj."projectStartDate"
            pj."projectEndDate"
            pj."projectDeveloperId"
            pt."technologyId"
            tc."technologyName"
        FROM 
            projects pj
        JOIN
            projects_technologies pt ON pt."projectId" = pj."id";
        JOIN
            technoligies tc ON pt."technologyId" = tc."id"
        WHERE
            pt."projectId" = $1;
    `;

  const queryResult: QueryResult<IProject> = await client.query(queryString);

  return res.json(queryResult.rows);
};

const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: IProject = req.body;
  const id: number = parseInt(req.params.id);

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

  const queryResult: QueryResult<IProject> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteProject = async (
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

const postTechInProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // const projectId: number = parseInt(req.params.id);
  // const { name } = req.body;
  // const queryString: string = format(`
  //   INSERT INTO
  //     projects_technologies
  //     (%I)
  //     VALUES
  //     (%L)
  //   RETURNING *;
  // `);
};

const deleteTechInProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = res.locals.id;

  const queryString: string = `
    DELETE FROM
      projects_technologies
    WHERE
      technologyId=$1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

export {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  postTechInProject,
  deleteTechInProject,
};
