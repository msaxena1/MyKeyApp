import React, { useContext, useEffect, useReducer } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './App.css'
import Login from './container/login/Login';
import Tile from './components/Tile/Tile';
import Button from './components/Button/Button';
import AddNewForm from './components/AddNewForm/AddNewForm'; 
import { AuthenticationContext } from './store/Store';
 
const updateServer = (url, newKeyList) => {
  fetch( url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newKeyList)
  })
  .then( (response) => response.json() )
  .then( ( data ) => {
    console.log( JSON.stringify(data))
  } )
  .catch( (err) => console.log('post err') );
}

const reducer = ( state, action ) => {
  switch ( action.type ) {
    case 'INIT':
      return action.payload;
    case 'ADD':
      return [ ...state, action.payload ];
    case 'DELETE':
      const keys = [ ...state ];
      const newKeys = keys.filter(element => element.name !== action.payload.name);
      return newKeys;
    case 'UPDATE_SERVER':
      updateServer( action.payload.url, state );
    default:
      return state;
  }
};

const App = () => { 
  const authContext = useContext( AuthenticationContext );
  const isAuthenticated = authContext.isAuthenticated;
  const hostname = window.location.host;
  const url = `http://${ hostname }/data`
  const [ keyList, updateKeyList ] = useReducer( reducer, [] );

  useEffect( () => {
    fetch( url )
    .then( (response) => response.json() )
    .then( ( res ) => {
      if ( res.success ) {
        const keysFromFile = res.data;

        updateKeyList( { type: 'INIT', payload: keysFromFile } );
      }
    } )
    .catch( (err) => console.log('fetch err') );
  }, [] );

  const addItemToList = ( entry ) => {
    if ( !entry.addr.startsWith('http') ) {
      entry.addr = 'https://'+ entry.addr;
    }
    const payload = {
      url: entry.addr, 
      name: entry.desc,
      content: {
        username: entry.user,
        password: entry.pwd,
        email: entry.email,
        phone: entry.phone,
        misc: entry.misc
      }
    };

    updateKeyList( { type: 'ADD', payload: payload } );
    updateKeyList( { type: 'UPDATE_SERVER', payload: {url: url} } );
  }

  const deleteItemFromList = ( entry ) => {
    updateKeyList( { type: 'DELETE', payload: { name: entry } } );
    updateKeyList( { type: 'UPDATE_SERVER', payload: {url: url} } );
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/add'>
          <AddNewForm addItemToList={addItemToList}/>
        </Route>
        <Route exact path='/'>
          <div>
          <div>
            <h2 align='center'>MyKeyApp </h2>
            { isAuthenticated? <Link to='/add'><Button name='Add New' />
              </Link>  : null }

          </div>       
            { !isAuthenticated? (<Login />) : 
              keyList.map( (item, index) => (
                <Tile 
                  url={item.url} 
                  name={item.name} 
                  content={item.content}
                  style={item.style}
                  key={index}
                  delete={deleteItemFromList}
                />
                ) ) 
            }
        </div>
        </Route>
      </Switch>
    </BrowserRouter>
    
  );
}

export default App;
