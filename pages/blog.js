import { firestore, fromMillis, postToJSON } from "../lib/firebase";
import { useState } from "react";
import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
const paginationLimit = 10

export default function Blog(props) {
  const [posts, setPosts] = useState(props.posts);   
  const [postsEnd, setPostsEnd] = useState(false);   
  const [loading, setLoading] = useState(false);   

  const getMorePosts = async () => {
      setLoading(true)
      const last = posts[posts.length - 1]
      const postQuery = firestore
        .collection('posts')
        .where('published','==',true)
        .orderBy('createdAt', 'desc')
        .startAfter(cursor)
        .limit(paginationLimit)
        
     const newPosts = (await postQuery.get()).docs.map((doc) => doc.data())
     
     setPosts(posts.concat(newPosts))
     if(newPosts.length < paginationLimit){
         setPostsEnd(true)
     }
     setLoading(false)
  }

  const getMorePostsOfWords = async(e) => {
    var value = e.target.value;

    if(value.length <= 3){
      return;
    }
    setLoading(true)
    posts = [];
    const searchQuery = firestore
    .collection('posts')
    .where('published', '==', true)
    .orderBy('title')
    .startAfter(value)
    .endAt(value + '~')
   
    const newPosts = (await searchQuery.get()).docs.map((doc) => doc.data())
    if(newPosts.length <= 0){
      //No results found
      toast.error(`Tu busqueda para ${value} no ha devuelto resultados`)
      setLoading(false)
      return
    }
    setPosts(posts.concat(newPosts))
    setLoading(false)
  }

  return (
    <main>
        {!posts || posts.length <= 0 && (
          <div className="box-center"><h1 className="text-danger">Parece que aqui no hay nada!</h1></div>
        )}
        {posts && posts.length > 0 && (
          <>
        <input type="text" placeholder="Buscar..." onChange={getMorePostsOfWords}></input>
        <PostFeed posts={posts} admin={false} />
        {!loading && !postsEnd && <button onClick={getMorePosts}>Cargar mas</button>}
        <Loader show={loading}/>
        {postsEnd && 'No hay nada mas que ver...'}
        </>
        )}

    </main>
  )
}

export async function getServerSideProps(context){
    const postQuery = firestore
    .collection('posts')
    .where('published','==',true)
    .orderBy('createdAt', 'desc')
    .limit(paginationLimit)

    const posts = (await postQuery.get()).docs.map(postToJSON);

    return {
        props: { posts }
    };
}