import React, { useContext, useState } from 'react';
import './Login.css';
import Button from '../../components/Button/Button';
import { AuthenticationContext } from '../../store/Store';

const Login = React.memo( () => {

    const [ secrets, setSecrets ] = useState( { secret1: '', secret2: '' } );

    const authContext = useContext( AuthenticationContext );
    const isAuthenticated = authContext.isAuthenticated;
    const processSecrets = () => authContext.dispatch( { type: 'LOGIN', payload: secrets } );

    if ( !isAuthenticated ) {
        return (
            <div>
                <form>
                    <span className="displayInline-25">secret1: </span>
                    <span className="displayInline-75">
                        <input className="textInput" type="text" value={secrets.secret1} 
                        onChange={ event => setSecrets( { ...secrets, secret1: event.target.value } )}/>
                    </span>
                    <span className="displayInline-25">secret2: </span>
                    <span className="displayInline-75">
                        <input className="textInput" type="text" value={secrets.secret2} 
                        onChange={ event => setSecrets( { ...secrets, secret2: event.target.value } )}/>
                    </span>
                    <Button name='Login' click={ processSecrets }  />
                </form>
            </div>
        );
    }
    return null;
 } );

export default Login;