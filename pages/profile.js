import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import PostFeed from '../components/PostFeed';
import UserProfile from '../components/UserProfile';
import { auth, getRecentPostsOfAuthor } from '../lib/firebase';
import Loader from '../components/Loader';
import CenterDiv from '../components/CenteredDiv';
import AuthCheck, { EmailVerifiedCheck } from '../components/AuthCheck';

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

    const verificationStillNeeded = {}
    return (

                <AuthCheck>
                    <EmailVerifiedCheck fallback={<CenterDiv><h1>Necesitas verificar el email de tu cuenta</h1></CenterDiv>}>
                        <UserProfile user={userData}/>
                    </EmailVerifiedCheck>
                </AuthCheck>

        )    
}

