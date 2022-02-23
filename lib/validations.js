


export default function validateInfo(values) {
    let errors = {};
    if (!values.email) {
      errors.email = 'Email es un campo requerido';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Esta dirección de email no es valiad';
    }
    if (!values.password) {
      errors.password = 'El campo Password nopuede estar vacío';
    } else if (values.password.length < 6) {
      errors.password = 'Un password debe contener almenos 6 caracteres';
    }


    return errors;
  }