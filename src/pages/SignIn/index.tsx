import React, { useRef, useCallback }  from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web';
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationsErros from '../../utils/getValidationsErrors';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface ISignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => { 
    const formRef = useRef<FormHandles>(null);
    const history = useHistory();
    
     const { signIn } = useAuth();
     const { addToast } = useToast();

    const handleSubmit = useCallback( async(data: ISignInFormData) => {
        try{
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail Obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().required('Senha obrigatória'),
            });
            await schema.validate(data, {
                abortEarly: false,
            });
            await signIn({
                email: data.email,
                password: data.password,
            });
            history.push('/dashboard');
        }catch(err){
            if(err instanceof Yup.ValidationError){
                const errors = getValidationsErros(err);
                formRef.current?.setErrors(errors);
                return;
            }
            console.log(err);
            addToast({
                type: 'error',
                title: 'Erro na autenticação',
                description: 'Ocorreu um erro ao fazer login.'
            });
        }
    }, [signIn, addToast, history]);
    
    return (
    <Container>
        <Content>
            <AnimationContainer>
                <img src={logoImg} alt='GoBarbar' />
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Faça seu Logon</h1>
                    <Input icon={FiMail} name="email" placeholder="E-mail" />
                    <Input icon={FiLock} name="password" placeholder="Senha" type="password"/>
                    <Button type="submit">Entrar</Button>
        
                    <Link to="/forgot-password">Esqueci minha senha</Link>
                </Form>
                <Link to="signup"><FiLogIn/>Criar Conta</Link>
            </AnimationContainer>
        </Content>
        <Background/>
    </Container>
    );
}
 

export default SignIn;