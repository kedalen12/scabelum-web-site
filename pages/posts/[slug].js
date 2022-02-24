import Loader from "../../components/Loader";
import PostContent from "../../components/PostContent";
import { firestore, getPostBySlug } from "../../lib/firebase";

export async function getStaticProps({ params }) {
    const { slug } = params;
    let post = await getPostBySlug(slug);
    if (!post) {
        return {
            props: { post: null },
            revalidate: 5000
        }
    }
    return {
        props: { post },
        revalidate: 5000
    };
}

export async function getStaticPaths() {
    const snapshot = await firestore.collection('posts').get()
    const paths = snapshot.docs.map((doc) => {
        const { slug } = doc.data()
        return {
            params: { slug }
        }
    })
    return {
        paths,
        fallback: 'blocking'
    }
}

export default function PostPage({ post }) {

    return (
        <main className="">
            {!post && (
                <div className="card">
                    <h1 className="text-danger">Este artículo no existe</h1>
                    <Loader show={true} color={'red'} />
                </div>
            )}
            {post && (
                <>

                    <section>
                        <PostContent post={post} />

                    </section>
                    <aside className="card">
                        <p>
                            <strong>{post.heartCount || 0} 🤍</strong>
                        </p>

                    </aside>
                </>
            )}

        </main>
    );
}