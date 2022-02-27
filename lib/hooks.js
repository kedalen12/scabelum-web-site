import { auth, firestore } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import {useEffect, useState} from 'react'
import validateInfo from './validations';
import toast from 'react-hot-toast';

export function useUserData(){
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    let unsubscribe;
    let lastUserData;
    toast.success(`User Data reevaluated ${user ? 'Has user' : 'No user'}`)
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
      lastUserData = unsubscribe;
    } else{
      setUserData(lastUserData)
    }
    return unsubscribe
  }, [user])

  return {user, userData}
}



export function useForm(expectedValues, callback){
  const eValues = expectedValues;
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
    toast.success(`Submited`)
    setErrors(validateInfo(values, eValues));
    toast.success(Object.keys(errors).length)
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