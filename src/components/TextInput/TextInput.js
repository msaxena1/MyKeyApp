import React from 'react';
import './TextInput.css'

const TextInput = (props) => {
    return (
        <div>
            <span className="displayInline-25">{props.label}: </span>
            <span className="displayInline-75">
                    <input className="textInput" type="text" value={props.value} />
            </span>
        </div>
    );
}

export default TextInput;