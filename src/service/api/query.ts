import { UseBaseQueryOptions, useQuery } from "react-query";
import qs from "query-string";
import { createApiRequest } from "./createApiRequest";

const keysToRemoveFromQueryKey = ["sort_ascending"];

export interface definitionOptions {
  key: ((arg: string) => string[]) | string[];
  url: string;
  options?: Partial<UseBaseQueryOptions>;
}

export interface usageOptions<TData> {
  queryParams?: Record<string, string>;
  enabled?: boolean;
  onSuccess?: (data: TData, ...args: Record<string, unknown>[]) => void;
}

export const createQuery = <TData, TError = unknown>(
  definitionOptions: definitionOptions
) => {
  const useQueryFn = (usageOptions?: usageOptions<TData>) => {
    if (!usageOptions) {
      usageOptions = {};
    }

    const { url, key } = definitionOptions;
    const { queryParams = {}, ...rest } = usageOptions;

    const mergeOptions = {
      ...definitionOptions.options,
      ...rest //usage options
    };

    const transformedFilters = transformFiltersToKey(queryParams);

    const params = queryParams ? qs.stringify(queryParams) : "";
    const keyParams = transformedFilters
      ? qs.stringify(transformedFilters)
      : "";

    const queryKey = typeof key === "function" ? key(keyParams) : key;

    return useQuery<unknown, TError, TData, any>({
      queryKey,
      queryFn: () =>
        createApiRequest<TData>({ url, queryParams: params, method: "GET" }),
      ...mergeOptions
    });
  };

  return useQueryFn;
};

const transformFiltersToKey = (filters: Record<string, string>) => {
  keysToRemoveFromQueryKey.forEach((key) => {
    delete filters[key];
  });
  return filters;
};
