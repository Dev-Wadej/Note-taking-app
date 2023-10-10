import { BlogForm } from "../../components/BlogForm";
import { NoteData, Tag } from "../../types";

type NewBlogPostProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function NewBlogPost({
  onSubmit,
  availableTags,
  onAddTag
}: NewBlogPostProps) {
  return (
    <>
      <h1 className="mb-4">Create New Blog</h1>
      <BlogForm
        onSubmit={onSubmit}
        availableTags={availableTags}
        onAddTag={onAddTag}
      />
    </>
  );
}
