import { NoteData, Tag } from "./App";
import { NoteForm } from "./NoteForm";
import { useNote } from "./NoteLayout";


type EditNoteProps={
    onSubmit:(id:string,data:NoteData)=>void
    onAddTag:(tag:Tag)=>void
    availableTags:Tag[]
}


export function EditNote({onSubmit,availableTags,onAddTag}:EditNoteProps){
const {id,title,markdown,tags}= useNote()
    return (
        <>
        <h1 className="mb-4">Edit Note</h1>
        <NoteForm onSubmit={(data)=>onSubmit(id,data)} availableTags={availableTags} onAddTag={onAddTag} title={title} markdown={markdown} tags={tags}/>
        </>
    )
}