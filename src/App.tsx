import 'bootstrap/dist/css/bootstrap.min.css';
import { useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NewNote } from './NewNote';
import {v4 as uuidV4} from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { Notelist } from './NoteList';
import { NoteLayout } from './NoteLayout';
import Note from './Note';
import { EditNote } from './EditNote';


export type Note = {
  id:string
} & NoteData


export type NoteData={
  title:string
  markdown:string
  tags:Tag[]
}

export type Tag={
  id:string
  label:string
}


export type RawNote={
  id: string
}&RawNoteData

export type RawNoteData={
  title:string
  markdown:string
  tagIds:string[]
}
function App() {

  const [notes,setNotes]=useLocalStorage<RawNote[]>('NOTES',[])
  const [tags,setTags]=useLocalStorage<Tag[]>('TAGS',[])

  


  const notesWithTags= useMemo(()=>{
    return notes.map(note=>{
      return{...note,tags: tags.filter(tag=> note.tagIds.includes(tag.id))}
    })
  },[notes,tags])

  function onCreateNote({tags,...data}:NoteData){
    setNotes(prevNotes=>{
      return [...prevNotes,{...data,id:uuidV4(),tagIds:tags.map(tag=>tag.id)}]
    })
  }
  function onDeleteNotes(id:string){
      setNotes(prevNotes=>{
        return prevNotes.filter(note=>note.id !== id)
      })
  }
  function onUpdateNote(id:string,{tags, ...data}:NoteData){
    setNotes(prevNotes=>{
      return prevNotes.map(note=>{
        if(note.id === id){
          return {...note,...data,tagIds:tags.map(tag=>tag.id)}

        }else{
          return note 
     }
  })
})
}

  function addTag(tag:Tag){
    setTags(prev=>[...prev,tag])
  }

  function updateTag(id:string,label:string){
    setTags(prevTags=>{
      return prevTags.map(tag=>{
        if(tag.id === id){
          return {...tag,label}
        }
        else{
          return tag
        }
      })
    })

  }
  function deleteTag(id:string){
    setTags(prevTags=>{
      return prevTags.filter(tag=>tag.id !== id)
    })
  }



  return (
    <Container className="my-4">
      <Routes>
        <Route path='/' element={<Notelist onUpdateTag={updateTag} onDeleteTag={deleteTag} notes={notesWithTags} availableTags={tags}/>}/>
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} availableTags={tags} onAddTag={addTag}/>}/>
          <Route path='/:id' element={<NoteLayout notes={notesWithTags}/>} >
              <Route index element={<Note onDelete={onDeleteNotes}/>}></Route>
              <Route path='edit' element={<EditNote  onSubmit={onUpdateNote} availableTags={tags} onAddTag={addTag}/>}></Route>
          </Route>
        <Route path='*' element={<Navigate to={'/'}/>}/>  
      </Routes>
    </Container>
  )
}

export default App
