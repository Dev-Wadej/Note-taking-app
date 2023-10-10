import { AxiosResponse, ResponseType } from "axios";
import Axios from "./index";

export interface createApiOptions {
  url: string;
  queryParams?: string;
  data?: Record<string, unknown> | FormData;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  apiOptions?: {
    responseType?: ResponseType;
    headers?: Record<string, string>;
  };
}

export const createApiRequest = async <TData>(
  options: createApiOptions
): Promise<TData> => {
  const { url, queryParams, method, data, apiOptions = {} } = options;
  const fullUrl = `${url}${queryParams ? `?${queryParams}` : ""}`;

  const response = await Axios({
    url: fullUrl,
    method,
    //withCredentials: true,
    ...(data ? { data: data } : {}),
    ...apiOptions
  })
    .then((response: AxiosResponse<TData>) => {
      return response.data; // return data only, not the whole response
    })
    .catch((error) => {
      throw error;
    });

  return response;
};
