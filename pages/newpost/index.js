import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../lib/context";
import { auth, firestore } from "../../lib/firebase"

export default function AdminPage({ }){
 
    const {user, userData} = useContext(UserContext)
    const router = useRouter()
    const createNewPost = async function() {
        const d =  await firestore.collection('posts').add({
            title : 'Título',
            editorRaw: {
                blocks : [],
                entityMap : {}
            },
            author : user.uid,
            published : false
        });
        router.push(`/newpost/${d.id}`)
    }

    useEffect(() => {
        createNewPost()
    },[])
    return (
        <main>
        </main>
    )
}