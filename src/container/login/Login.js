import React, { useContext } from 'react';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import { AuthenticationContext } from '../../store/Store';

const Login = React.memo( () => {
    const authContext = useContext( AuthenticationContext );
    const isAuthenticated = authContext.isAuthenticated;

    const dispatchLogin = () => authContext.dispatch( { type: 'LOGIN', payload: 'manoj'} );

    if ( !isAuthenticated ) {
        return (
            <div>
                <TextInput label='secret1' />
                <TextInput label='secret2'/>
                <Button name='Login' click={ dispatchLogin }  />
            </div>
        );
    }
    return null;
 } );

export default Login;