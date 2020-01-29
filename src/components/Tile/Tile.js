import React, { useState } from 'react';
import './Tile.css';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';

const Tile = React.memo( ( props ) => {
    const [ showModal, setShowModal ] = useState( false );
    const buttonTitle = showModal ? 'Hide Details' : 'Show Details';
    const toggleDetails = () => setShowModal( !showModal );

    const modal = showModal ? ( 
                    <Modal 
                        content={props.content} 
                        url={props.url} 
                        name={props.name} 
                        click={toggleDetails}
                    />
                    ) : null ;

    return (
        <React.Fragment>
            <div className='tile' >
                <div>
                    <Button name={props.name} click={toggleDetails} />
                </div>
                {modal}
            </div>
        </React.Fragment>
    );
} );

export default Tile;