import React from 'react';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';


const Login = () => {
    return (
        <div>
            <TextInput label='secret1' />
            <TextInput label='secret2'/>
            <Button name='login' />
        </div>
    );
};

export default Login;