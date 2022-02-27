import BaseForm from "../components/BaseForm";
import InputField from "../components/InputField";
import * as FaIcons from 'react-icons/fa'
import { useForm } from "../lib/hooks";
import { useState } from "react";
import ErrorLabel from "../components/ErrorLabel";
import { auth, createUserAsync, firestore, getFirebaseLoginErrorFormated, signInAsync } from "../lib/firebase";
import { ProviderId } from "firebase/auth";
import toast from "react-hot-toast";
import WaitingDonut from "../components/WaitingDonut";
import { useEffect } from "react";
import AuthCheck, { EmailVerifiedCheck } from "../components/AuthCheck";
import { useRouter } from "next/router";
import Link from "next/link";
const wasLoggedIn = auth.currentUser === null ? 0 : 1;


export default function SignInPage(){
   

    const formSchema = {
        email : '',
        password : '',
        firstName : '',
    }
    const router = useRouter()
    const { handleChange, handleSubmit, values, errors, setErrors, setValues } = useForm(formSchema, onFormValidation);

    const [registerProcess, setRegisterProcess] = useState(0)  

    const [isLogin, setIsLogin] = useState(true)    

    const [isSubmitted, setIsSubmitted] = useState(false);

    const signIn = async (provider) => {
        try{
            const result = await signInAsync(provider, values.email, values.password)
            if(result.success){
            }
        } catch(e){
        }
    }

    const registerUser = async function(provider){
        const creationResult = await createUserAsync(provider,values.email, values.password, values.firstName)
        if(!creationResult.success){
            return
        } else if(!creationResult.verified) {
            auth.currentUser.sendEmailVerification();
        }
    }
    
    function onFormValidation (){
        setIsSubmitted(true);

        if(!isLogin){
            if(registerProcess === 0){
                registerUser(ProviderId.GITHUB)
                setRegisterProcess(1)
            }         
        } else {
            signIn(ProviderId.GITHUB)
        }
    } 

    const nonAuthorizedAccess = (
        <BaseForm onSubmit={handleSubmit}> 
            {GetForm({isLogin,setIsLogin,handleChange, errors, registerProcess, setRegisterProcess,values,setErrors, setValues})}
        </BaseForm>
    )
    return (
        <AuthCheck fallback={nonAuthorizedAccess}>
            <EmailVerifiedCheck fallback={verificationStillNeeded(setRegisterProcess)}>
            <BaseForm>

                <Link href="/">
                    <>
                    <h1>Tu cuenta ya ha sido verificada!</h1>
                    <br></br>
                <iframe src="https://giphy.com/embed/diUKszNTUghVe" width="397" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
                <br></br>
                    <button className="btn pointer-click">Volver al Inicio</button>
                    </>
                </Link>
                </BaseForm>
            </EmailVerifiedCheck>
        </AuthCheck>
    )
}


const GetForm = function ({isLogin,setIsLogin,handleChange, errors, registerProcess, setRegisterProcess, values, setErrors, setValues}) { 

    if(isLogin){
        return LoginForm({setIsLogin, handleChange, errors, registerProcess, setRegisterProcess, setErrors, setValues})
    }else {
        return RegisterForm({setIsLogin, handleChange, errors, registerProcess, setRegisterProcess, setErrors, setValues})
    }
}

const LoginForm = function({setIsLogin, handleChange, errors, registerProcess, setRegisterProcess, setErrors, setValues}){
 
    if(registerProcess !== 0){
        return RegisterForm({setIsLogin, handleChange, errors, registerProcess, setRegisterProcess, setErrors, setValues})
    }

   return ( <>
            <h1>Acceder</h1>
            <InputField enabled={true} name="email" onChange={handleChange}  type='email' placeHolder='email@email.com' icon={<FaIcons.FaUserAstronaut/>} />
            <ErrorLabel condition={errors.email} error={errors.email}/>
            <InputField enabled={true} name="password" onChange={handleChange} type='password' placeHolder='password' icon={<FaIcons.FaKey/>}/>
            <ErrorLabel condition={errors.password} error={errors.password}/>
            <p className="social-text cursor-click">He olvidado mi contraseña</p>
            <p className="social-text cursor-click" onClick={() => {
                setErrors({})
                setValues({})
                setIsLogin(false)
                
            }
                }>Aún no tienes una cuenta? Registrate.</p>
            <input type="submit" className="btn cursor-click-white" value='Acceder'/>
            <div className="social-media">
            </div>
        </>
   )
}
const onSuccessHtml = (
    <>
    <h1>Tu cuenta ha sido verificada!</h1>
            <FaIcons.FaCheckDouble className="icon-big"/>
    </>
)
const verificationStillNeeded = (setRegisterProcess) => { 
    
    return (
    <BaseForm>
    <WaitingDonut conditon={() => {
        auth.currentUser?.reload()
        return auth.currentUser?.emailVerified === true;
    }} checkConditionEvery={500} overWaiting={'Necesitamos verificar tu cuenta...'} underWaiting={'Porfavor haz click en el enlace que te hemos enviado'} callBack={() => {
        setRegisterProcess(2)
    }} onSuccessHtml={onSuccessHtml}/>
    <input className="btn cursor-click-white" value="No me ha llegado ningun correo" onClick={(e) => {
        e.preventDefault()
        if(canClick){
            canClick = false;
            auth.currentUser?.sendEmailVerification()
            toast.success(`Se ha enviado un correo electronico de nuevo`)
            setTimeout(() => { canClick = true }, 30000)
        }
    }} />
    </BaseForm>
)
}

const RegisterForm = function({setIsLogin, handleChange, errors, registerProcess, setRegisterProcess, setErrors, setValues}){

    const registrationStep = (
        <>
            <h1>Registro</h1>
            <InputField enabled={true} name="email" onChange={handleChange}  type='email' placeHolder='email@email.com' icon={<FaIcons.FaUserAstronaut/>} />
            <ErrorLabel condition={errors.email} error={errors.email}/>
            <InputField enabled={true} name="password" onChange={handleChange} type='password' placeHolder='password' icon={<FaIcons.FaKey/>}/>
            <ErrorLabel condition={errors.password} error={errors.password}/>
            <InputField enabled={true} name="firstName" onChange={handleChange} type='text' placeHolder='nombre completo' icon={<FaIcons.FaAddressBook/>}/>
            <ErrorLabel condition={errors.firstName} error={errors.firstName}/>
            <p className="social-text cursor-click" onClick={() => {
                setErrors({})
                setValues({})
                setIsLogin(true)  
                }}>Ya tienes una cuenta? Accede.</p>
            <input type="submit" className="btn cursor-click-white" value='Enviar'/>
            <div className="social-media">
            </div>
        </>
    )

    //Esto deberia comprobar cada medio segundo si el usuario ha sido verificado
    
    let canClick = true;
  

    if(registerProcess === 0){
        return registrationStep
    } else if(registerProcess === 2){
        return onSuccessHtml
    } else {
        return verificationStillNeeded
    }
}