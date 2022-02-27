import Link from "next/link";
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";





export default function AuthCheck(props) {
    const { user, userData  } = useContext(UserContext)


 
    return user ? 
            props.children :
            props.fallback || <Link href="/"> 
                Necesitar estar identificado para ver esta página
             </Link>
}


export function EmailVerifiedCheck(props){
    const { user, userData  } = useContext(UserContext)

    return user.emailVerified ?  props.children : props.fallback 
}


export function AdminAuthCheck(props){
    const { user, userData  } = useContext(UserContext)
    if(!user || !userData) {
        return props.fallback;
    }
    return userData.admin ?  props.children : props.fallback; 
}