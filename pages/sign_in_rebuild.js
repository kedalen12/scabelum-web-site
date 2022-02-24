import BaseForm from "../components/BaseForm";
import InputField from "../components/InputField";
import * as FaIcons from 'react-icons/fa'
import { useForm } from "../lib/hooks";
import { useState } from "react";
import ErrorLabel from "../components/ErrorLabel";
import Loader from "../components/Loader";
import { auth, createUserAsync, firestore, getFirebaseLoginErrorFormated } from "../lib/firebase";
import { ProviderId } from "firebase/auth";
import toast from "react-hot-toast";


export default function SignInPage(){
   

    const formSchema = {
        email : '',
        password : '',
        firstName : '',
    }

    const { handleChange, handleSubmit, values, errors, setErrors, setValues } = useForm(formSchema, onFormValidation);

    const [registerProcess, setRegisterProcess] = useState({
        step : 0
    })    

    const [isLogin, setIsLogin] = useState(true)    

    const [isSubmitted, setIsSubmitted] = useState(false);

    const signIn = async () => {
        try{
            const user = await createUserAsync(ProviderId.GOOGLE, email, password)
            

        } catch(e){
            toast.error(e.code)
        }
    }

    const registerUser = async function(provider){
        const creationResult = await createUserAsync(provider,values.email, values.password, values.firstName)
        if(!creationResult.success){
            toast.error(getFirebaseLoginErrorFormated(creationResult.error))
            return
        } else if(!creationResult.verified) {
            auth.currentUser.sendEmailVerification();
        }
    }

    function onFormValidation (){
        setIsSubmitted(true);
        if(!isLogin){
            if(registerProcess.step === 0){
                registerUser(ProviderId.GITHUB)
                setRegisterProcess(1)
            }
        }
    } 
    


    return (
        <BaseForm elements={
            GetForm({isLogin,setIsLogin,handleChange, errors, registerProcess, setRegisterProcess, setErrors, setValues})
        } onFormSubmit={handleSubmit}/>
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
 
    if(registerProcess.step !== 0){
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
            <input type="submit" className="btn" value='Acceder'/>
            <p className="social-text">O acceder con tus redes sociales</p>
            <div className="social-media">
            </div>
        </>
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
            <input type="submit" className="btn" value='Enviar'/>
            <p className="social-text">O acceder con tus redes sociales</p>
            <div className="social-media">
            </div>
        </>
    )

    const verificationStep = (
        <>
            <h1>
                Te hemos enviado un correo de verificación.
            </h1>
            <br></br>
            <Loader show={true} big={true}/>
            <br></br>
            <h1>Haz click en el enlace del correo y podras acceder a tu cuenta.</h1>
        </>
    )

    if(registerProcess.step === 0){
        return registrationStep
    } else  {
        return verificationStep
    }
}