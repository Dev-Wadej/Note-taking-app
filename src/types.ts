export const CONST = {
  id: "60d21b4667d0d8992e610c85",
  image: "https://img.dummyapi.io/photo-1564694202779-bc908c327862.jpg",
  likes: 43,
  owner: {
    id: "60d0fe4f5311236168a109ca",
    title: "ms",
    firstName: "Sara",
    lastName: "Andersen"
  },
  publishDate: "2020-05-24T14:53:17.598Z",
  tags: ["animal", "dog", "golden retriever"],
  text: "adult Labrador retriever"
};

export type Note = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
  date?: string;
};

export type Tag = {
  id: string;
  label: string;
};

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
  date?: string;
};
