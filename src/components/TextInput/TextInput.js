import React from 'react';
import './TextInput.css'

const TextInput = React.memo( ( props ) => {

    return (
        <React.Fragment>
            <span className="displayInline-25">{props.label}: </span>
            <span className="displayInline-75">
                    <input className="textInput" type="text" value={props.value} 
                    onChange={ event => props.change( event.target.value )}/>
            </span>
        </React.Fragment>
    );
} );

export default TextInput;