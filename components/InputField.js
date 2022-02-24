import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function InputField({ enabled, icon, type, placeHolder, onChange, onBlur, onFocus, bindValue, name }){
    return (
        <div className={icon ? 'input-field' : 'input-field no-icon'}>
            {icon}
            <input type={type} name={name} placeholder={placeHolder} onChange={onChange ? onChange : (e) => {
                if(bindValue){
                    bindValue = e.target.value
                }
            }} disabled={!enabled} onBlur={onBlur} ></input>
        </div>
    )
}