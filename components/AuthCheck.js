import { faL } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";





export default function AuthCheck({props, fallback}) {
    const { user, userData  } = useContext(UserContext)

    if(!props){
        return fallback || <Link href="/"> 
        Necesitar estar identificado para ver esta página
        </Link>
    }
    return user ? 
            props.children :
            fallback || <Link href="/"> 
                Necesitar estar identificado para ver esta página
             </Link>
}


export function EmailVerifiedCheck({props,fallback}){
    const { user, userData  } = useContext(UserContext)

    return !user.emailVerified ?  props.children : fallback 
}


export function AdminAuthCheck({props,href}){
    const { user, userData  } = useContext(UserContext)

    return (userData.admin) ?  props.children : fallback 
}