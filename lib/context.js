import { createContext } from 'react';

const user = null;
const userData = null;
export const UserContext = createContext({user, userData})


export const Delay = function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
