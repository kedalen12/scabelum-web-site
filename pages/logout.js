import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { auth } from "../lib/firebase";



export default function LogoutComponent(){
    const router = useRouter();
    useEffect(() => {
        auth?.signOut();
        router.push('/signin')
    }, [])
    
    
    return (<></>)
}