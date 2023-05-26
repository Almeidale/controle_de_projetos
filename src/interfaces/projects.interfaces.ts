type TProject = {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate?: Date;
  developerId: number;
};
type TProjectRequest = Omit<TProject, "id">;

type TProjectResponse = {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date;
  projectDeveloperId: number;
  technologyId: number;
  technologyName: string;
};

type TProjectTechnologies = {
  id: number;
  addedIn: Date;
  projectId?: number;
  technologyId?: number;
};

type TProjectTechnologiesRequest = Omit<TProjectTechnologies, "id">;

type TTechnologies = {
  id: number;
  name: string;
};

type TTechnologiesRequest = Omit<TTechnologies, "id">;

export {
  TProject,
  TProjectRequest,
  TProjectResponse,
  TProjectTechnologies,
  TProjectTechnologiesRequest,
  TTechnologies,
  TTechnologiesRequest,
};
