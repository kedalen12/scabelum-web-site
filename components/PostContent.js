import Link from 'next/link';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { UserContext } from '../lib/context';
import { firestore } from '../lib/firebase';
import Loader from './Loader';
// UI component for main post content
export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : new Date(post.createdAt.toDate());
  const {user, userData} = useContext(UserContext)
  const onSubmit = (e) => {
    e.preventDefault();
    const postDoc = firestore.doc(`posts/${post.docId}`);    
    try{
        post.update({
            published: true
        });
        toast.success(`El artículo se ha publicado correctamente`)
        window.location.reload(false);
    }catch(e){
        toast.error(`${e}`)
    }
}
  
  if(!post.published){
    if(!user || post.author_id != user.uid ){
        return (
            <div className="card">
                <h1>Este artículo no esta disponible</h1>
                <Loader show={true}/>
            </div>
        )
    } else {
        return(
            <>
        <h1 className='text-danger'>Este artículo aun no se ha publicado.</h1>
        <div className="card">
          <h1>{post?.title}</h1>
          <span className="text-sm">
            Escrito por {post.author} {' '}
            el {createdAt.toLocaleDateString("es-ES")}
          </span>
          <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
        <button className='btn-green' onClick={onSubmit}>Publicar</button>
        </>
        )
    }
  } else {
    return (
        <div className="card">
          <h1>{post?.title}</h1>
          <span className="text-sm">
            Escrito por {post.author} {' '}
            el {createdAt.toLocaleDateString("es-ES")}
          </span>
          <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
      );
  }
  
  
}