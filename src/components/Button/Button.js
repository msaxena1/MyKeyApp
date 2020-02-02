import React from 'react';
import './Button.css';

const Button = React.memo ( ( props ) => {
    const url = `${props.url}favicon.ico`;
    console.log(url);
    return (
        <React.Fragment>
            <div className="div-button">
                <button className="btn" onClick={props.click} >
                    <img className='buttonImg' src={url} alt='' />
                    {props.name}
                </button>
            </div>
        </React.Fragment>
    );
} );

export default Button;

