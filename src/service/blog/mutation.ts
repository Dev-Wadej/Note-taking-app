import { createMutation } from "../api/mutation";
import { getPostKey } from "./queries";

export const useCreateBlog = createMutation({
  url: "/post/create",
  method: "POST",
  keysToRefetch: [getPostKey]
});

export const useUpdateBlog = createMutation({
  url: "/post",
  method: "PUT",
  keysToRefetch: [getPostKey]
});

export const useDeleteBlog = createMutation({
  url: "/post",
  method: "DELETE",
  keysToRefetch: [getPostKey]
});
