import { auth, firestore } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import {useEffect, useState} from 'react'
import validateInfo from './validations';

export function useUserData(){
 const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    let unsubscribe;

    if(user){
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUserData({ 
          firstName : doc.data()?.firstName, 
          secondName: doc.data()?.secondName, 
          lastName: doc.data()?.lastName,
          admin : doc.data()?.admin, 
          verified : doc.data()?.verified})
      })
    } else{
      setUserData(null)
    }
    return unsubscribe
  }, [user])

  return {user, userData}
}



export function useForm(expectedValues, callback){
  const [values, setValues] = useState(expectedValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    setErrors(validateInfo(values));
    setIsSubmitting(true);
  };

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
          callback();
      }
    },
    [errors]
  );

  return { handleChange, handleSubmit, values, errors, setErrors, setValues };
}