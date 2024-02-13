import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Modal.css";
import Table from "../Table/Table";

const Modal = (props) => {
  const [editable, setEditable] = useState(false);
  const [username, setUser] = useState(props.content.username);
  const [password, setPwd] = useState(props.content.password);
  const [email, setEmail] = useState(props.content.email);
  const [phone, setPhone] = useState(props.content.phone);
  const [misc, setMisc] = useState(props.content.misc);
  const tableContent = [
    {
      key: "username",
      value: username,
      update: editable ? setUser : null,
    },
    {
      key: "password",
      value: password,
      update: editable ? setPwd : null,
    },
    {
      key: "email",
      value: email,
      update: editable ? setEmail : null,
    },
    {
      key: "phone",
      value: phone,
      update: editable ? setPhone : null,
    },
    {
      key: "misc",
      value: misc,
      update: editable ? setMisc : null,
    },
  ];

  const deleteEntry = () => {
    props.delete(props.name, props.index);
    props.click();
  };

  const toggleEditable = (event) => {
    if (editable) {
      props.update({
        content: {
          user: username,
          pwd: password,
          email: email,
          phone: phone,
          misc: misc,
        },
        name: props.name,
        addr: props.url,
        index: props.index,
      });
      props.click();
    } else {
      setEditable(!editable);
    }
  };

  return (
    <div className="modal-details">
      <div className="modal-details-content">
        <span className="close" onClick={props.click}>
          &times;
        </span>
        <a href={props.url} target="_blank">
          {props.name}
        </a>
        <Table content={tableContent} />
        {editable ? (
          <p>
            <button onClick={toggleEditable} className="editbtnModal">
              <Link to="/">Save</Link>
            </button>
          </p>
        ) : (
          <p>
            <button
              type="submit"
              onClick={deleteEntry}
              className="cancelbtnModal"
            >
              Delete
            </button>
            <button
              type="submit"
              onClick={toggleEditable}
              className="editbtnModal"
            >
              Edit
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Modal;
