import React, { useState } from "react";
import "./Tile.css";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

const Tile = (props) => {
  //    const Tile = React.memo( ( props ) => {

  const getContent = props.content;
  const index = props.index;
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState({});

  const toggleDetails = () => {
    getContent(index).then((data) => {
      setContent(data);
      setShowModal(!showModal);
      return;
    });
  };

  const modal = showModal ? (
    <Modal
      content={content}
      url={props.url}
      name={props.name}
      index={props.index}
      click={toggleDetails}
      delete={props.delete}
      update={props.update}
    />
  ) : null;

  return (
    <React.Fragment>
      <div className="tile">
        <div>
          <Button name={props.name} url={props.url} click={toggleDetails} />
        </div>
        {modal}
      </div>
    </React.Fragment>
  );
};

export default Tile;
