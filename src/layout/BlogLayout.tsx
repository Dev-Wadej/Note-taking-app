import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams
} from "react-router-dom";
import { Note } from "../types";
import { useGetBlogPostById } from "../service/blog/queries";

type BlogLayoutProps = {
  notes: Note[];
};
export function NoteLayout({ notes }: BlogLayoutProps) {
  const { id, routeid } = useParams();

  const { data, isLoading } = useGetBlogPostById({
    queryParams: {
      id: routeid as string
    }
  });
  const note = notes.find((n) => n.id === id);
  if (note == null) return <Navigate to={"/"} replace />;
  return <Outlet context={note} />;
}

export function useBlog() {
  return useOutletContext<Note>();
}
