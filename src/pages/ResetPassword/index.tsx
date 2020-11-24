import React, { useRef, useCallback }  from 'react';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web';
import * as Yup from 'yup'
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationsErros from '../../utils/getValidationsErrors';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/apiClient';

interface IResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => { 
    const formRef = useRef<FormHandles>(null);
    const history = useHistory();
    const location = useLocation();
    
    const { addToast } = useToast();

    const handleSubmit = useCallback( async(data: IResetPasswordFormData) => {
        try{
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                password: Yup.string().required('Senha obrigatória'),
                password_confirmation: Yup.string()
                 .oneOf([Yup.ref('password')], 'Confirmação Incorreta'),              
              });
            await schema.validate(data, {
                abortEarly: false,
            });

            const { password, password_confirmation} = data;
            const token = location.search.replace('?token=',  '');

            if(!token){
                throw new Error();
            }
            await api.post('/password/reset', {
                password,
                password_confirmation,
                token 
            });
          
            history.push('/');
        }catch(err){
            if(err instanceof Yup.ValidationError){
                const errors = getValidationsErros(err);
                formRef.current?.setErrors(errors);
                return;
            }
            console.log(err);
            addToast({
                type: 'error',
                title: 'Erro ao resetar senha',
                description: 'Ocorreu um erro ao resetar sua senha.'
            });
        }
    }, [addToast, history, location.search]);
    
    return (
    <Container>
        <Content>
            <AnimationContainer>
                <img src={logoImg} alt='GoBarbar' />
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Resetar Senha</h1>
                    <Input icon={FiLock} name="password" placeholder="Nova Senha" type="password"/>
                    <Input icon={FiLock} name="password_confirmation" placeholder="Confirmação de senha" type="password"/>
                    <Button type="submit">Alterar Senha</Button>
        
                </Form>
            </AnimationContainer>
        </Content>
        <Background/>
    </Container>
    );
}
 

export default ResetPassword;