import React, {InputHTMLAttributes, useEffect, useRef, useState, useCallback } from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { Container, Error } from './styles';
import { useField } from '@unform/core';
import  Tooltip  from '../Tooltip';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement>{
    name: string;
    icon: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<IInputProps> = ({name, icon: Icon, ...rest}) => {
    const inputRef = useRef<HTMLInputElement>(null); // Com o input ref é possível ter acesso ao DOM, como por exemplo o value do input
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const { fieldName, defaultValue, error, registerField } = useField(name)
    
    // useCallback é utilizado para chamar a função apenas uma vez, ou seja, ela não será chamada sempre que o componente for chamado,
    // já que a função ficará salva na memória
    // IMPORTANTE!!! SEMPRE Usar useCallback sempre que for chaamr uma função dentro de um componente
    const handleInputBlur = useCallback(() => { 
        setIsFocused(!!inputRef.current?.value);        
    }, []);


    const handleInputFocus = useCallback(() =>{
        setIsFocused(true);
    }, []);

    useEffect(() => {
        registerField({
            name: fieldName, 
            ref: inputRef.current, // O que dá acesso ao input no html
            path: 'value', // Valor do input
        });
    }, [fieldName, registerField]);

    return (
        <Container isErrored={!!error} isFilled={isFilled} isFocused={isFocused}>
            {Icon && <Icon size={20}/>}
            <input 
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            defaultValue={defaultValue} ref={inputRef} {...rest} />
            {error && (
            <Error title={error} >
                <FiAlertCircle color="#c53030" size={20}/>
            </Error> 
            )}   
        </Container>
    )
};

export default Input;