import React from 'react';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';

const isAuthenticated = true;

const Login = () => isAuthenticated ? (
    <div>
        <TextInput label='secret1' />
        <TextInput label='secret2'/>
        <Button name='login' />
    </div>
    ) : null ;

export default Login;