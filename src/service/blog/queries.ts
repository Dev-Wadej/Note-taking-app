import { createQuery } from "../api/query";

export const getPostKey = ["get-post-key"];

export const useGetBlogPost = createQuery<BlogPostType[]>({
  url: "/post",
  key: getPostKey
});

const getPostByIdKey = (arg: string) => ["get-post-key", arg];
export const useGetBlogPostById = createQuery<BlogPostType>({
  url: "/post",
  key: getPostByIdKey
});
