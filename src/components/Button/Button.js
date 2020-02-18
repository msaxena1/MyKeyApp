import React from 'react';
import './Button.css';
const url = require('url');

const Button = React.memo ( ( props ) => {
    const targetUrl = props.url ? url.parse(props.url, true) : null;
    let favUrl;
    if (targetUrl) {
       favUrl = `https://${targetUrl.host}/favicon.ico`;
    }

    return (
        <React.Fragment>
            <div className="div-button">
                <button className="btn" onClick={ (e) => { 
                    if ( props.click ) {
                        e.preventDefault();
                        props.click(e);
                    }

                    }} >
                    <img className='buttonImg' src={favUrl} alt='' />
                    {props.name}
                </button>
            </div>
        </React.Fragment>
    );
} );

export default Button;

