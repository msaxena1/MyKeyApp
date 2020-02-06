import React from 'react';
import './Button.css';
const Url = require('url-parse');

const Button = React.memo ( ( props ) => {
    const targetUrl = props.url ? new Url(props.url) : null;
    let favUrl;
    if (targetUrl) {
        favUrl = `https://${targetUrl.hostname}/favicon.ico`;
    }

    console.log(favUrl);
    return (
        <React.Fragment>
            <div className="div-button">
                <button className="btn" onClick={props.click} >
                    <img className='buttonImg' src={favUrl} alt='' />
                    {props.name}
                </button>
            </div>
        </React.Fragment>
    );
} );

export default Button;

