import { ValidationError } from 'yup';

interface IValidationErros{
    [key: string]: string;
}

export default function getValidationErrors(err: ValidationError):IValidationErros{
    const validationsErros: IValidationErros = {};
    err.inner.forEach(error => {
        validationsErros[error.path] = error.message
    });
    
    return validationsErros;
}