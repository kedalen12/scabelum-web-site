import Link from 'next/link';

export default function PostFeed({ posts, admin}) {
    if(!posts){
        return <h1>No has publicado ningun artículo</h1>
    }
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}


function PostItem({ post, admin = false }) {
    // Naive method to calc word count and read time
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  
    return (
      <div className="card">
        <p> Autor: <strong> {post.author}</strong> </p>
        <Link href={`/posts/${post.slug}`}>
          <h2>
            <a>{post.title}</a>
          </h2>
        </Link>
  
        <footer>
          <span>
            {wordCount} Palabras. {minutesToRead} minutos para leer
          </span>
          <span className="push-left">💗 {post.heartCount || 0} Likes</span>
        </footer>
  
        {/* If admin view, show extra controls for user */}
        {admin && (
          <>
            <Link href={`/admin/${post.slug}`}>
              <h3>
                <button className="btn-blue">Editar</button>
              </h3>
            </Link>
  
            {post.published ? <p className="text-info">Publicado</p> : <p className="text-info">Bozeto</p>}
          </>
        )}
      </div>
    );
  }