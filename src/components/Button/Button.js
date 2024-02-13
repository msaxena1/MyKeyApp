import React from "react";
import "./Button.css";

const Button = React.memo((props) => {
  const targetUrl = props.url ? props.url : null;
  let favUrl;
  if (targetUrl) {
    const url = new URL(targetUrl);
    favUrl = `${url.protocol}//${url.host}/favicon.ico`;
  }

  return (
    <React.Fragment>
      <div className="div-button">
        <button
          className="btn"
          onClick={(e) => {
            if (props.click) {
              e.preventDefault();
              props.click(e);
            }
          }}
        >
          <img className="buttonImg" src={favUrl} alt="" />
          {props.name}
        </button>
      </div>
    </React.Fragment>
  );
});

export default Button;
