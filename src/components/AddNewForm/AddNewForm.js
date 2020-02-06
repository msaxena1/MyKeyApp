import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import './AddNewForm.css';
import { AuthenticationContext } from '../../store/Store';

const AddNewForm = ( props ) => {
    const authContext = useContext( AuthenticationContext );
    const isAuthenticated = authContext.isAuthenticated;

    const [ desc, setDesc ] = useState('');
    const [ addr, setAddr ] = useState('');
    const [ user, setUser ] = useState('');
    const [ pwd, setPwd ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ misc, setMisc ] = useState('');

    const submitHandler = ( event ) => {
        console.log( {desc, addr, user, pwd, email, phone, misc} );
        event.preventDefault();
    };

    const cancelHandler = ( event ) => {
        console.log( 'cancelHandler called' );
    };
    
    const addForm = isAuthenticated ? (
        <form className="modal-content" onSubmit={submitHandler}>
        <div className="container">
            <h1>Add New</h1>
            <hr />
            <label><b>Description</b></label>
            <input type="text" value={desc} onChange={ e => setDesc(e.target.value)} placeholder="Enter Description" name="desc" required />
            
            <label><b>Web Address</b></label>
            <input type="text" value={addr} onChange={ e => setAddr(e.target.value)} placeholder="Enter Url" name="url" required />

            <label><b>User Name</b></label>
            <input type="text" value={user} onChange={ e => setUser(e.target.value)} placeholder="User Name" name="uname" required />
            
            <label><b>Password</b></label>
            <input type="text" value={pwd} onChange={ e => setPwd(e.target.value)} placeholder="Enter Password" name="psw" required />

            <label><b>Email</b></label>
            <input type="text" value={email} onChange={ e => setEmail(e.target.value)} placeholder="Enter Email" name="email" required />
            
            <label><b>Phone</b></label>
            <input type="text" value={phone} onChange={ e => setPhone(e.target.value)} placeholder="Enter Phone" name="phone" required />
            
            <label><b>Misc Info</b></label>
            <input type="text" value={misc} onChange={ e => setMisc(e.target.value)} placeholder="Enter Misc Info" name="misc" required />
            
            <div className="clearfix">
                <button type="submit" className="addbtn">Save</button>
                <button type="button" className="cancelbtn"><Link to='/'>Cancel</Link></button>
            </div>
        </div>
    </form>
    ) : null;

    return (
        <div>
            {addForm}
        </div>
        );

}

export default AddNewForm;