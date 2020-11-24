import React, { createContext, useCallback, useContext, useState } from 'react';
import ToastContainer from '../components/ToastContainer';
import { v4 as uuid } from 'uuid';

interface IToastContextData {
    addToast(message: Omit<IToastMessage, 'id'>): void;
    removeToast(id: string): void;
}

export interface IToastMessage {
    id: string;
    type: 'success' | 'error'| 'info';
    title: string;
    description?:  string;
}

const ToastContext = createContext<IToastContextData>({} as IToastContextData);

const ToastProvider: React.FC = ({children}) => {

    const [messages, setMessages] = useState<IToastMessage[]>([]);

    const addToast = useCallback(({type, title, description}: Omit<IToastMessage, 'id'>) => {
        const id = uuid();
        const toast = { 
            id,
            type,
            title,
            description
        };
        setMessages((oldmessages) => [...oldmessages, toast]); 
    }, []);
    const removeToast = useCallback((id: string) => {
        setMessages(oldMessages => oldMessages.filter(message => message.id !== id));
    }, []);

    return (
            <ToastContext.Provider value={{addToast, removeToast}}>
                {children}
            <ToastContainer messages={messages}/>
            </ToastContext.Provider>   
        );
};

function useToast(): IToastContextData{
    const context = useContext(ToastContext);
    if(!context){
        throw new Error('useToast must be withn a ToastProvider');
    }
    return context;
}

export { ToastProvider, useToast };