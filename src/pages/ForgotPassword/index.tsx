import React, { useRef, useCallback, useState }  from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web';
import * as Yup from 'yup'
import { Link } from 'react-router-dom';


import { useToast } from '../../hooks/toast';
import getValidationsErros from '../../utils/getValidationsErrors';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/apiClient';

interface IForgotPasswordFormData {
    email: string;
    password: string;
}

const ForgotPassword: React.FC = () => { 
    const [loading, setLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);
    
     const { addToast } = useToast();

    const handleSubmit = useCallback( async(data: IForgotPasswordFormData) => {
        try{
            setLoading(true);
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail Obrigatório').email('Digite um e-mail válido')
            });
            await schema.validate(data, {
                abortEarly: false,
            });
            
            api.post('/password/forgot', {
                email: data.email,                
            });

            addToast({
                type: 'success',
                title: 'E-mail de recuperação enviado',
                description: 'Enviamos um e-mail para confirmar a recuperação de senha',
            });

            //history.push('/dashboard');
        }catch(err){
            if(err instanceof Yup.ValidationError){
                const errors = getValidationsErros(err);
                formRef.current?.setErrors(errors);
                return;
            }
            console.log(err);
            addToast({
                type: 'error',
                title: 'Erro na Recuperação de Senha',
                description: 'Ocorreu um erro ao tentar Realizar a recuperação de senha'
            });
        } finally {
            setLoading(false);
        }
    }, [addToast]);
    
    return (
    <Container>
        <Content>
            <AnimationContainer>
                <img src={logoImg} alt='GoBarbar' />
                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Recuperar Senha</h1>
                    <Input icon={FiMail} name="email" placeholder="E-mail" />
                    <Button type="submit" loading={loading}>Recuperar</Button>
        
                </Form>
                <Link to="signup"><FiLogIn/>Voltar ao login</Link>
            </AnimationContainer>
        </Content>
        <Background/>
    </Container>
    );
}
 

export default ForgotPassword;