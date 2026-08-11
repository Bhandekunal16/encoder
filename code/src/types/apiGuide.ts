export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiResponseExample = {
  data: string;
  status: boolean;
  msg: string;
  statusCode: number;
};

export type ApiSample = {
  id: string;
  title: string;
  method: HttpMethod;
  code: string;
  payload: Record<string, string>;
  response: ApiResponseExample;
};

export type SamplesConfig = {
  samples: ApiSample[];
};

export type ApiGuideConfig = {
  title: string;
  description: string;
  tooltip: string;
};

export type RouteConfig = {
  base: string;
};
