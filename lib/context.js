import { createContext } from 'react';


export const UserContext = createContext({user : null, userData : null})


export const Delay = function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
