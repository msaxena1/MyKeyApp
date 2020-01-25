import React from 'react';
import './Button.css';

const Button = React.memo ( ( props ) => {
    return (
        <React.Fragment>
            <div className="div-button">
                <button className="login" onClick={props.click}>{props.name}</button>
            </div>
        </React.Fragment>
    );
} );

export default Button;

