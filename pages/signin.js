import { auth, firestore, getFirebaseLoginErrorFormated, googleAuthProvider } from "../lib/firebase";
import { isValidElement, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as CgIcons from "react-icons/cg";

import toast from 'react-hot-toast'
import Link from "next/link";

import { ValidateEmail } from "../lib/validations"
import InputField from "../components/InputField";
import { useRouter } from "next/router";
import BaseForm from "../components/BaseForm";

export default function EnterPage(props){
    const {user, userData} = useContext(UserContext);
    const router = useRouter();

    return (
        <main>
            <div className="box-center">
            {(user && userData) ?
                !userData.admin && !userData.verified ? <AdditionalDataForm /> : useEffect(() => {
                    router.push('/profile')
                }, [])
                :
                <>
                    <SignInForm />
                </>
            }
            </div>
        </main>
    )
}


function SignInButton(){
    const signInWithGoogle = async (e) => {
        e.preventDefault()
        try{
            var r =  await auth.signInWithPopup(googleAuthProvider);
        } catch(e){
            return null;
        }
      };

    return (
        <button className="btn-social" onClick={signInWithGoogle}>
            <AiIcons.AiFillGoogleCircle className="social-icon-login"/>
        </button>
    );
}


function AdditionalDataForm(){
    const [formValue, setFormValue] = useState({
        firstName : null,
        secondName: null,
        lastName: null
    })
    const [validName, setValidName] = useState(false);
    const [validSecondName, setValidSecondName] = useState(false);
    const [validLastName, setValidLastName] = useState(true);
    const [hasLastName, setHasLastName] = useState(false);
    const { user,userData } = useContext(UserContext);

    const onSubmit = (e) => {
        e.preventDefault();
        const d = new Date()
        firestore
        .doc(`users/${user.uid}`)
        .set({
            firstName: formValue.firstName,
            secondName: formValue.secondName,
            lastName: formValue.lastName ? formValue.lastName : null,
            admin: false,
            verified: true,
            createdAt: d.getTime(),
            lastLogin: d.getTime()
        });
    }

    const onFirstNameChange = (e) => {
        const val = e.target.value;
        const re = /[a-zA-Z]/;
        if(re.test(val)){
            formValue.firstName = val;
            setValidName(true)
        } else if(val){
            toast.error(`${val} no es un nombre valido`)
            setValidName(false)

            return
        } else {
            setValidName(false)
        }
        
    } 
    const onSecondNameChange = (e) => {
        const val = e.target.value;
        const re = /[a-zA-Z]/;
        if(re.test(val)){
            formValue.secondName = val;
            setValidSecondName(true)
        } else if(val){
            toast.error(`${val} no es un apellido valido`)
            setValidSecondName(false)

            return
        } else {
            setValidSecondName(false)
        }
        
    } 
    const onLastNameChange = (e) => {
        const val = e.target.value;
        const re = /[a-zA-Z]/;
        if(re.test(val)){
            formValue.lastName = val;
            setValidLastName(true)
            setHasLastName(true)
        } else if(val){
            toast.error(`${val} no es un apellido valido`)
            setValidLastName(false)
            setHasLastName(true)
        } else {
            setValidLastName(false)
            setHasLastName(false)
        }
    } 

    const getDisabled = function (){
        if(!hasLastName){
            return validName && validSecondName
        } 

        return validName && validSecondName && validLastName
    }

    
    return moreInfoNeededComponent(onFirstNameChange, onSecondNameChange, onLastNameChange, getDisabled, onSubmit)

    
}

function SignInForm(onFirstNameChange, onSecondNameChange, onLastNameChange, getDisabled, disabled){

    const signInWithEmailAndPassword = async () => {
        try{
            await auth.signInWithEmailAndPassword(formValue.email, formValue.password)
        } catch(e){
            toast.error(e.code)
        }
    }

    const registerUserWithEmailAndPassword = async () => {
        try{
            await auth.createUserWithEmailAndPassword(formValue.email, formValue.password)
        } catch(error)
        {
            var code = error.code;
            toast.error(getFirebaseLoginErrorFormated(code, formValue))
        }
    }

    const setValue = (valId, val) => {
        if(valId == 0){
            var cPass = formValue.password;
            setFormValue({
                password: cPass,
                email : val
            })
        } else {
            var cEmail = formValue.email;

            setFormValue({
                password: val,
                email : cEmail
            })
        }
    }

    const [formValue, setFormValue] = useState({
        email: null,
        password: null
    })
    const [validEmail, setValidEmail] = useState(false)
    
    const [loginState, setLoginState] = useState(true)

    const getSubmitFunction = () => {
        if(loginState){
            return signInWithEmailAndPassword
        }else {
            return registerUserWithEmailAndPassword
        }
    }

    const getElementText = function (element){
        if(loginState){
            if(element === 0){
                return "Necesito una cuenta nueva."
            } else if(element === 1){
                return "Acceder"
            }
        }else {

            if(element === 0){
                return "Ya tengo una cuenta."
            } else if(element === 1){
                return "Registrarme"
            }
           
        }
    }

    const getLinkText = function (){
        if(loginState){
            return "Necesito una cuenta nueva."
        }else {
            return "Ya tengo una cuenta."
        }
    }


    const onEmailChange = function (e) {
        const val = e.target.value;
        if(ValidateEmail(val)){
            setValidEmail(true)
            setValue(0, val)
        } else {
            setValidEmail(false)
            setValue(0, val)
        }
    }

    const sendPasswordRecoveryEmail = async () => {
        if(validEmail){
            try{
                await auth.sendPasswordResetEmail(formValue.email)
                toast.success("Sigue las instrucciones para recuperar tu contraseña en tu email.")
            } catch(e){
                toast.error("No se ha podido enviar el email de recuperación.")
            }
        } else {
            toast.error("Introduce un email valido.")
        }
    }

    const modifyFormState = () => {
        if(loginState){
            setLoginState(false)
        } else {
            setLoginState(true)
        }
    }
    return signInFormComponent(loginState,setLoginState,modifyFormState,validEmail, getSubmitFunction, getElementText, setValue, onEmailChange)
    
}


const moreInfoNeededComponent = function (onFirstNameChange, onSecondNameChange, onLastNameChange, getDisabled, onSubmit) {
    return (
        (
            <>
            <BaseForm onFormSubmit={onSubmit} elements={[
                <>
                    <h2>Necesitamos algo mas de información:</h2>
                    <InputField enabled={true} placeHolder='Nombre' icon={<CgIcons.CgAsterisk />} type='input' onChange={onFirstNameChange}/>
                    <InputField enabled={true} placeHolder='Apellido' icon={<CgIcons.CgAsterisk />} type='input' onChange={onSecondNameChange}/>
                    <InputField enabled={true} placeHolder='Segundo Apellido' icon={null} type='input' onChange={onLastNameChange}/>
                    <button className="btn" type="submit" disabled={!getDisabled()}>
                        Aceptar
                    </button>
                </>
            ]}/>
        </>
        )
    );
}

const signInFormComponent = function (loginState,setLoginState,modifyFormState,validEmail, getSubmitFunction, getElementText, setValue, onEmailChange){
    return (
        <>
            <BaseForm elements={[
                <>
                <h2 className="title">
                        Acceder
                    </h2>
                    <InputField enabled={true} placeHolder='email@mail.com' icon={<FaIcons.FaUserAstronaut/>} type='input' onChange={onEmailChange}/>
                    <InputField enabled={true} placeHolder='password' icon={<FaIcons.FaLock/>} type='password' onChange={(e) => 
                    {
                        setValue(1, e.target.value)
                    }}/>
                    <input type="button" onClick={getSubmitFunction()} disabled={!validEmail} className="btn solid" value={getElementText(1)}/>
                    {loginState && (
                    <p className="social-text cursor-click"> 
                            He olvidado mi contraseña
                    </p>
                    )}
                    <p className="social-text cursor-click" onClick={modifyFormState}>{getElementText(0)}</p>
                    <p className="social-text">O acceder con tus redes sociales</p>
                    <div className="social-media">
                        <SignInButton />
                    </div>
                </>
            ]} >

            </BaseForm>
        </>
    )
}