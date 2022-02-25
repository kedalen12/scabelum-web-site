import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import PostFeed from '../components/PostFeed';
import UserProfile from '../components/UserProfile';
import { auth, getRecentPostsOfAuthor } from '../lib/firebase';
import Loader from '../components/Loader';

const fetchPosts = async function GetRecentPosts(setLoading, setHasFetched, setPosts, hasFetched, user){
    if(!user){
        return;
    }
    if(!hasFetched){
        setLoading(true)
        let p = await getRecentPostsOfAuthor(user.uid);
        setPosts(p)
        setLoading(false)
        setHasFetched(true)
    }
}

export default function Profile(){
    const {user, userData} = useContext(UserContext)
    const [posts, setPosts] = useState({})
    const [hasFetched, setHasFetched] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(!auth.currentUser?.emailVerified){
            window.location.href = "/signin"
        }

        fetchPosts(setLoading, setHasFetched, setPosts, hasFetched, user)
    }, [])

    if(!user || !userData){
        return <main>
        
        </main>
    } else {
        return (
            <main>
                <UserProfile user={userData}/>
                {userData.admin && (
                    <>
                    {!posts || posts.length <= 0 && (
                        <Loader show={loading}/>
                    )}
                    {posts && posts.length > 0 && (
                        <PostFeed posts={posts} admin={true}/>
                    )}
                    {hasFetched && (
                        <h1>Parece que no has publicado ningun artículo</h1>
                    )}
                    </>
                )}
            </main>
        )
    }
    
    
}

