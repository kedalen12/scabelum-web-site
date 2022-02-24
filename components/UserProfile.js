import { useState } from "react"
import Select from "./Select"


const generoOptions = [
    {val: 'male', label : 'Hombre'},
    {val: 'female', label : 'Mujer'},
    {val: 'other', label : 'Otro/Prefiero no decirlo'},
]

export default function UserProfile({user}) {
    const [formValue, setFormValue] = useState({
        firstName : user.firstName,
        secondName : user.secondName,
        lastName : user.lastName,
        genero : undefined,
    })

    return (
        <section>
            <div className="box-center">
                <h1>Bienvenido@, {user.firstName} {user.secondName} {user.lastName}</h1>
                </div>
                <div className="card">

                <form>
                    <label className="text-info">Nombre:</label>
                    <input type="text" value={formValue.firstName}></input>
                    <label className="text-info">Apellido:</label>
                    <input type="text" value={formValue.secondName}></input>
                    <label className="text-info">Segundo Apellido:</label>
                    <input type="text" value={formValue.lastName}></input>
                    <label className="text-info">Genero:</label>
                    <Select options={generoOptions} value={'generoOption'} onChange={() => {
                        
                    }} />
                </form>
                </div>
        </section>
    )
}