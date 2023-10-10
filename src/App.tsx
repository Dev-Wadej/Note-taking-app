import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { NewBlogPost } from "./pages/CreateBlogPost/NewBlogPost";
import { v4 as uuidV4 } from "uuid";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Bloglist } from "./pages/BlogList/BlogList";
import { NoteLayout } from "./layout/BlogLayout";
import Note from "./components/Blog";
import { EditBlogPost } from "./pages/EditBlogPost/EditBlogPost";
import Layout from "./layout/layout";
import "./index.css";
import { CONST, NoteData, RawNote, Tag } from "./types";
import { useCreateBlog } from "./service/blog/mutation";

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [
    { id: "da0680fa-b7da-4ag8-a003-6150c0725807", label: "tech" },
    { id: "da0680fa-b7da-4a38-a003-6150d0725807", label: "music" },
    { id: "da0680fa-b7da-4a83-a003-6150e0725807", label: "photography" },
    { id: "da0680fa-b7da-4a28-a003-6150f0725807", label: "nature" }
  ]);
  const { mutate } = useCreateBlog({});

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id))
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        {
          ...data,
          id: uuidV4(),
          tagIds: tags.map((tag) => tag.id),
          date: new Date() as unknown as string
        }
      ];
    });
    mutate({
      text: CONST.text,
      image: CONST.image,
      likes: CONST.likes,
      tags: CONST.tags,
      owner: CONST.owner.id
    });
  }
  function onDeleteNotes(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
            date: new Date() as unknown as string
          };
        } else {
          return note;
        }
      });
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }
  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <Bloglist
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
              notes={notesWithTags}
              availableTags={tags}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewBlogPost
              onSubmit={onCreateNote}
              availableTags={tags}
              onAddTag={addTag}
            />
          }
        />
        <Route
          path="/:id/:routeid"
          element={<NoteLayout notes={notesWithTags} />}
        >
          <Route index element={<Note onDelete={onDeleteNotes} />}></Route>
          <Route
            path="edit"
            element={
              <EditBlogPost
                onSubmit={onUpdateNote}
                availableTags={tags}
                onAddTag={addTag}
              />
            }
          ></Route>
        </Route>
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </Layout>
  );
}

export default App;
