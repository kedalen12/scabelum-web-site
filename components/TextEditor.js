
import { useState } from "react";
import { firestore } from "../lib/firebase";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDocumentOnce } from 'react-firehooks';
import Loader from './Loader';
import CenterDiv from "../components/CenteredDiv"
import dynamic from 'next/dynamic';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromRaw } from 'draft-js';
import { convertToRaw } from 'draft-js';
import { EditorState } from "draft-js";

import draftToHtml from "draftjs-to-html";

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false,
})


export default function TextEditor () {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const router = useRouter()
  const { slug } = router.query; 

  const [snapshot] = useDocumentOnce(firestore.collection('posts').doc(slug))

  useEffect(()=> {
    
    if (snapshot?.data()?.editorRaw) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorRaw)
        )
      )
    }
  }, [snapshot])

  const onEditorStateChange = (editorState) =>  {
    setEditorState(editorState);
    let raw = convertToRaw(editorState.getCurrentContent())
    firestore.collection('posts')
    .doc(slug)
    .set({
      editorRaw : raw,
      editorHtml : draftToHtml(raw),
    }, {
      merge: true
    })
  }

  const publish = () => {
    let raw = convertToRaw(editorState.getCurrentContent())
    firestore.collection('posts')
    .doc(slug)
    .set({
      editorRaw : raw,
      editorHtml : draftToHtml(raw),
      published : true
    }, {
      merge: true
    })
  }

  return (
    <>
    {Editor && (
      <>
      <Editor
        editorState={editorState}
        editorClassName='editor-box'
        onEditorStateChange={onEditorStateChange}
      />
      <input type='button' className="btn cursor-click-white" value='Publicar'  onClick={publish}/>
      </>
    )}

    {!Editor && (
      <CenterDiv>
      <Loader big={true} show={true}></Loader>
      </CenterDiv>
    )}
  </>
  )
}

