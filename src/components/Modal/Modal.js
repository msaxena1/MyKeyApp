import React from 'react';
import './Modal.css';
import Table from '../Table/Table';

const Modal = React.memo( (props) => {

    return (
        <div className='modal'>
          <div className='modal-content'>
            <span className="close" onClick={props.click}>&times;</span>
            <a href={props.url} target='_blank' >{props.name}</a>
            <Table content={props.content}/>
          </div>
        
        </div>
    );
});

export default Modal;