

export default function BaseForm({onFormSubmit, elements}){
    return (
        <div className="container">
            <div className="forms-container">
                <div className="signin-signup">
                    <form className="signin" onSubmit={onFormSubmit}>                     
                    {elements}
                    </form>
                </div>
            </div>
        </div>
    )
}