import { useParams } from "react-router-dom";
import { BlogForm } from "../../components/BlogForm";
import { useBlog } from "../../layout/BlogLayout";
import { CONST, NoteData, Tag } from "../../types";
import { useUpdateBlog } from "../../service/blog/mutation";

type EditBlogPostProps = {
  onSubmit: (id: string, data: NoteData, routeid: string) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function EditBlogPost({
  onSubmit,
  availableTags,
  onAddTag
}: EditBlogPostProps) {
  const { id, title, markdown, tags } = useBlog();
  const { routeid } = useParams();

  const { mutate } = useUpdateBlog({
    addedUrl: routeid as string
  });
  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <BlogForm
        onSubmit={(data) => {
          onSubmit(id, data, routeid as string);
          mutate({
            text: CONST.text,
            image: CONST.image,
            likes: CONST.likes,
            tags: CONST.tags
          });
        }}
        availableTags={availableTags}
        onAddTag={onAddTag}
        title={title}
        markdown={markdown}
        tags={tags}
      />
    </>
  );
}
