import { useContext, useState } from "react"
import * as FaIcons from "react-icons/fa"
import { UserContext } from "../lib/context"
import BaseForm from "./BaseForm"
import InputField from "./InputField"
import Select from "./Select"
import {updateUserAsync} from "../lib/firebase"
import { useForm } from "../lib/hooks";
import toast from "react-hot-toast"


const generoOptions = [
    {val: 'male', label : 'Hombre'},
    {val: 'female', label : 'Mujer'},
    {val: 'other', label : 'Otro/Prefiero no decirlo'},
]

export default function UserProfile(props) {


    const formSchema = {
        name: null,
        m_name: null,
        l_name : null
    }
    const {user, userData} = useContext(UserContext);
    const { handleChange, handleSubmit, values, errors, setErrors, setValues } = useForm(formSchema, onFormValidation);

    const [isLogin, setIsLogin] = useState(true)    

    const [isSubmitted, setIsSubmitted] = useState(false);

   async function onFormValidation(){
        
        let toUpdate = {
            firstName: isDifferent(formValue.firstName, values.name) ? values.name : formValue.firstName,
            secondName: isDifferent(formValue.secondName, values.m_name) ? values.m_name : formValue.secondName,
            lastName: isDifferent(formValue.lastName, values.l_name) ? values.l_name: formValue.lastName,
        }

        await updateUserAsync(toUpdate)
        return;
    }

    const isDifferent = async function(p1, p2) {
        return p1 !== p2
    }

    const [formValue, setFormValue] = useState({
        firstName : userData.firstName,
        secondName : userData.secondName,
        lastName : userData.lastName,
        genero : userData.gender,
    })

    return (
        <BaseForm onSubmit={handleSubmit}>
            <h1>Bienvenido@, {props.user.firstName}</h1>
            <InputField enabled={true} name="name" icon={<FaIcons.FaUserAstronaut/>} onChange={handleChange} placeHolder={formValue.firstName}/>
            <InputField enabled={true} name="m_name" icon={<FaIcons.FaAccusoft/>} onChange={handleChange}   placeHolder={formValue.secondName}/>
            <InputField enabled={true} name="l_name" icon={<FaIcons.FaUserAstronaut/>} onChange={handleChange}  placeHolder={formValue.lastName} />
            <input type="submit" className="btn cursor-click-white" value='Actualizar'/>
        </BaseForm>
    )
}