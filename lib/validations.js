import toast from "react-hot-toast";



export default function validateInfo(values, expectedValues) {
    let errors = {};
    
    if(expectedValues.email){
      toast.success('Email validating')
    if (!values.email)  {
      errors.email = 'Email es un campo requerido';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Esta dirección de email no es valiad';
    }
  }
    if(expectedValues.password){
    if (!values.password) {
      errors.password = 'El campo Password nopuede estar vacío';
    } else if (values.password.length < 6) {
      errors.password = 'Un password debe contener almenos 6 caracteres';
    }
  }


    return errors;
  }