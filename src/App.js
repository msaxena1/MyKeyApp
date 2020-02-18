import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './App.css'
import Login from './container/login/Login';
import Tile from './components/Tile/Tile';
import Button from './components/Button/Button';
import AddNewForm from './components/AddNewForm/AddNewForm'; 
 
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
      break;

    default:
      return state;
  }
};



const App = () => { 
  const [ isAuthenticated, setIsAuthenticated ] = useState( false );
  const [ keyList, updateKeyList ] = useReducer( reducer, [] );
  const [ iv, setIv ] = useState( undefined );
  const [ isFirstTime, setIsFirstTime ] = useState( true );


  const encryptKeyReducer = ( state, action ) => {
    switch ( action.type ) {
      case 'UPDATE_KEY':
        const newState = { ...state, encryptKey: action.payload };
        console.log('newState: ' + JSON.stringify(newState));
        console.log(keyList);
        setIsAuthenticated( true );
        return newState;
  
      default:
        return state;
    }
  };
  const [ encryptKey, setEncryptKey ] = useReducer( encryptKeyReducer, {} );

  
  const hostname = window.location.host;
  const url = `http://${ hostname }/data`;
  console.log('encryptKey: ' + JSON.stringify(encryptKey));
  console.log('keyList: ' + JSON.stringify(keyList));

  useEffect( () => {

    //fetch( url )
    // Promise.resolve({"success":"true", "iv": "manoj", "data":[{"url":"https://github.com","name":"github","content":{"username":"m-github","password":"m-github-pwd","email":"m@github.com","phone":"72323243434","misc":"misc-github"}},{"url":"https://www.yahoo.com","name":"yahoo","content":{"username":"m-yahoo","password":"m-yahoo-pwd","email":"manoj@yahoo.com","phone":"7","misc":"yaho misc"}}]})
    Promise.resolve({"success":"true",  "data":[]})
    //.then( (response) => response.json() )
    .then( ( res ) => {
      if ( res.success ) {
        const keysFromFile = res.data;

        if ( res.iv ) {
          setIv( res.iv );
        }

        if( keysFromFile.length ) {
          setIsFirstTime( false );
        }

        updateKeyList( { type: 'INIT', payload: keysFromFile } );
      }
    } )
    .catch( (err) => console.log('fetch err' + err) );
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
            { !isAuthenticated? (
              <Login isFirstTime={isFirstTime} 
              isAuthenticated={isAuthenticated} 
              setEncryptKey={setEncryptKey} />
              ) : 
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
