// Interface para a tabela "developers"
interface IDeveloper {
  id: number;
  name: string;
  email: string;
}

type CreateDeveloper = Omit<IDeveloper, "id">;

// Interface para a tabela "developer_infos"
interface IDeveloperInfo {
  id: number;
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOS";
  developerId: number;
}

type CreateDeveloperInfo = Omit<IDeveloperInfo, "id">;

export { IDeveloper, CreateDeveloper, IDeveloperInfo, CreateDeveloperInfo };
