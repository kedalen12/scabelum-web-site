import toast from "react-hot-toast"


export default function BaseForm(props){
    return (
        <div className="container">
            <div className="forms-container">
                <div className="signin-signup">
                    <form className="signin" onSubmit={props.onSubmit ? props.onSubmit : (e) => { 
                        e.preventDefault() 
                    }}>                     
                    {props.children}
                    </form>
                </div>
            </div>
        </div>
    )
}