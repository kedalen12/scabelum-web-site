



export default function ErrorLabel ( { condition, error } )
{
    if(condition){
        return <label className="label-error">{condition ? error : ''}</label>
    } else {
        return <></>
    }
}