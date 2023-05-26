type TDedeveloper = {
  id: number;
  name: string;
  email: string;
};
type TDedeveloperRequest = Omit<TDedeveloper, "id">;

type TDeveloperResponse = {
  developerId: string;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date;
  developerInfoPreferredOS: string;
};

type TDeveloperInfos = {
  id: number;
  developerSince: Date;
  preferredOS: string;
  developerId?: number;
};

type TDeveloperInfosRequest = Omit<TDeveloperInfos, "id">;

export {
  TDedeveloper,
  TDedeveloperRequest,
  TDeveloperResponse,
  TDeveloperInfos,
  TDeveloperInfosRequest,
};
