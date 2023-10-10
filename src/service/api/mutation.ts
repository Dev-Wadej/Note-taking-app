import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  MutationFunction
} from "react-query";
import { createApiRequest } from "./createApiRequest";
import qs from "query-string";
import { queryClient } from "../../queryClient";
import { AxiosResponse, ResponseType } from "axios";

// Definition of mutation options that include url, method, additional API options, and keys to refetch
interface DefinitionMutationOptions extends UseMutationOptions {
  url: string;
  method: "POST" | "PATCH" | "DELETE" | "PUT";
  apiOptions?: {
    responseType?: ResponseType;
    headers?: Record<string, string>;
  };
  keysToRefetch?: string[][];
}

// Definition of options for using the mutation that include query parameters, keys to refetch, and lifecycle hooks
interface UsageMutationOptions<TData> {
  queryParams?: Record<string, string>;
  refetch?: string[][];
  onSuccess?: (data: TData, ...arg: unknown[]) => void;
  onError?: (...args: unknown[]) => void;
  onSettled?: (...args: unknown[]) => void;
  addedUrl?: string;
}

// Payload type definition
export type PayloadType = Record<string, unknown> | FormData | undefined;

// The createMutation function that takes the definition options and returns a new function that takes usage options
// and returns a mutation result
export const createMutation = <TData>(
  definitionOptions: DefinitionMutationOptions
): ((
  arg: UsageMutationOptions<TData>
) => UseMutationResult<TData, unknown, PayloadType, unknown>) => {
  const useMutationFn = (usageOptions: UsageMutationOptions<TData>) => {
    let { url, keysToRefetch, method = "POST" } = definitionOptions;
    const {
      queryParams,
      refetch: usageRefetch,
      addedUrl,
      ...restUsageOptions
    } = usageOptions;

    url = `${url}/${addedUrl}`;
    // Merge keys for refetching
    const mergedKeys = mergeKeysToRefetch(keysToRefetch, usageRefetch);
    const params = queryParams ? qs.stringify(queryParams) : "";

    const mergedConfigs = mergeOptions<TData>(
      restUsageOptions,
      definitionOptions
    );

    // Overwrite onSuccess to include invalidation of queries
    const success = mergedConfigs.onSuccess;
    mergedConfigs.onSuccess = (...args) => {
      mergedKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      success?.(...args);
    };

    // Type of the mutation function
    const mutationFn: MutationFunction<TData, PayloadType | FormData> = (
      data?: PayloadType | FormData
    ) =>
      createApiRequest<AxiosResponse<TData>>({
        url,
        data,
        method,
        queryParams: params,
        apiOptions: definitionOptions.apiOptions
      }).then((response) => response as TData);

    return useMutation<TData, unknown, PayloadType, unknown>({
      mutationFn,
      ...mergedConfigs
    });
  };

  return useMutationFn;
};

// Merge keys for refetching. If keys exist in both the definition and usage options, they are combined.
const mergeKeysToRefetch = (
  keysToRefetch?: string[][],
  refetch?: string[][]
) => {
  let mergedKeys: string[][] = [];

  if (Array.isArray(keysToRefetch) && keysToRefetch.length > 0) {
    mergedKeys = [...mergedKeys, ...keysToRefetch];
  }

  if (Array.isArray(refetch) && refetch.length > 0) {
    mergedKeys = [...mergedKeys, ...refetch];
  }

  return mergedKeys;
};

// Merge usage and definition options, with usage options taking precedence
const mergeOptions = <T>(
  usageOptions?: UseMutationOptions<T>,
  definitionOptions?: UseMutationOptions
) => {
  const mergedOptions = {
    ...definitionOptions,
    ...usageOptions
  };

  return mergedOptions as UseMutationOptions<T, unknown, PayloadType, unknown>;
};
