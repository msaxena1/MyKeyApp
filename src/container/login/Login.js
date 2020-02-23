import React, { useState } from 'react';
import './Login.css';
import Button from '../../components/Button/Button';
import { getKey } from '../../crypto';

const Login = React.memo( (props) => {

    const [ secrets, setSecrets ] = useState( { secret1: '', secret2: '' } );
    const isAuthenticated = props.isAuthenticated;
    const name = props.isFirstTime ? 'Select Secrets' : 'Login';
    const setEncryptKey = props.setEncryptKey;

    const processSecrets = async ( event ) => {
        const encryptKey = await getKey( secrets.secret1, secrets.secret2 );

        setEncryptKey( { type: 'UPDATE_KEY', payload: encryptKey } );
    };


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
                    <Button name={name} click={ processSecrets }  />
                </form>
            </div>
        );
    }
    return null;
 } );

export default Login;