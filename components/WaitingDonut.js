import toast from "react-hot-toast";
import Loader from "./Loader";



export default function WaitingDonut({conditon, overWaiting, underWaiting, checkConditionEvery, callBack, onSuccessHtml }){


    let conditionResult = false;
    let conditionChecker = setInterval(() => {
        if(conditon() === true){
            conditionResult = true;
            callBack()
            clearInterval(conditionResult)
        }
    }, checkConditionEvery);

    if(conditionResult){
        conditionChecker();
        if(onSuccessHtml){
            return onSuccessHtml;
        } else {
            return <></>
        }
    } else {
        return (
            <>
            <h1>{overWaiting}</h1>
            <br></br>
            <Loader show={true} big={true}/>
            <br></br>
            <h1>{underWaiting}</h1>
            </>
        )
    }
}