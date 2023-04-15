import { IDeveloper } from "./developer.interfaces";

interface IProject {
  id: number;
  name: string;
  description: string | null;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number | null;
}

type CreateProject = Omit<IProject, "id">;

// Interface para a tabela "technologies"
type TTechnology = Omit<IDeveloper, "email">;

// Interface para a tabela "projects_technologies"
interface IProjectTechnology {
  id: number;
  addedIn: Date;
  technologyId: number;
  projectId: number;
}

export { IProject, TTechnology, IProjectTechnology, CreateProject };
