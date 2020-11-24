import React, {useCallback, useRef} from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import Api from '../../services/apiClient';
import { useToast } from '../../hooks/toast';

import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './styles';
import getValidationsErros from '../../utils/getValidationsErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface ISignUpFromData{
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {

    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback( async(data: ISignUpFromData) => {
        try{
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome Obrigatório'), 
                email: Yup.string().required('E-mail Obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'Mínimo de 6 digitos'),
            });
            await schema.validate(data, {
                abortEarly: false,
            });

            await Api.post('/users', data);
            addToast({
                type: 'success',
                title: 'Cadastro Realizado',
                description: 'Você já pode fazer seu logon no GoBarber'
            });
            history.push('/');

        }catch(err){
            console.log(err);
            if(err instanceof Yup.ValidationError){
                const errors = getValidationsErros(err);
                formRef.current?.setErrors(errors);
                return;
            }
            console.log(err);
            addToast({
                type: 'error',
                title: 'Erro no Cadastro',
                description: 'Ocorreu um erro ao fazer o cadastro.'
            });
        }
    }, [addToast, history]);
    return (
        <Container>
            <Background/>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt='GoBarbar' />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça seu Cadastro</h1>
                        <Input icon={FiUser} name="name" placeholder="Nome" />
                        <Input icon={FiMail} name="email" placeholder="E-mail" />
                        <Input icon={FiLock} name="password" placeholder="Senha" type="password"/>
                        <Button type="submit">Cadastrar</Button>
        
                    </Form>
                    <Link to="/"><FiArrowLeft/>Voltar para Logon</Link>
                </AnimationContainer>
            </Content>
        </Container>
    );

};




export default SignUp;