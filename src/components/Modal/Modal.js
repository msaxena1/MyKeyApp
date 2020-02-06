import React from 'react';
import './Modal.css';
import Table from '../Table/Table';

const Modal = React.memo( (props) => {
  const deleteEntry = () => {
    props.delete( props.name );
    props.click();
}
    return (
        <div className='modal-details'>
          <div className='modal-details-content'>
            <span className="close" onClick={props.click}>&times;</span>
            <a href={props.url} target='_blank' >{props.name}</a>
            <Table content={props.content}/>
            <p><button type="submit" onClick={deleteEntry} className="cancelbtnModal">Delete</button></p>
          </div>
        
        </div>
    );
});

export default Modal;