import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './App.css'
import Login from './container/login/Login';
import Tile from './components/Tile/Tile';
import Button from './components/Button/Button';
import AddNewForm from './components/AddNewForm/AddNewForm'; 
import { getIv, encrypt, decrypt } from './crypto';
const MyData = {"data":[{"iv":[232,42,173,228,231,45,208,130,117,165,97,21,137,138,72,240],"text":"MzAsMTIxLDEyNywyNDYsMjQxLDE2NSw3NywxMTQsMTQ5LDkzLDExOSw5OCwyMDEsMTc1LDEzOCwyMTcsMTEzLDExNCwxMDMsNzksMTEyLDEzMCwyMTgsMTQyLDE2Myw3LDE1MSwyMzgsMTcsNzIsMjA1LDk5LDk5LDI0Nyw1NSwxNSwxOTYsMjIzLDE0NSw3OCwxNTcsMjMxLDYyLDE2NSw1OSwxNTYsODgsMjQ4LDE1NSw4NywxMTYsMTE1LDE5OSwxMzcsNTEsNjcsMTk2LDE4LDE0NCwyMDIsMTQ3LDE1LDk0LDEzNSw1NSwxMTMsMjM4LDE1NSwyMTUsMjAyLDcyLDgsNTYsMTc5LDE5LDE5MiwzMSw0LDU4LDEyLDgyLDk2LDY4LDIzMSwxMTEsOCw3NSw2OSwxOTQsNjgsMTc3LDEzOCwyMzgsMTI2LDEwMSwxMzgsODAsMTUsNTEsNzksMjM2LDgsMzcsOSw0Nyw0NiwxNjgsMTU1LDE3Miw3MiwyMDksMTEyLDEyNiwxMjcsMTc3LDIxMSwxMjYsMTkwLDIyMSwxNzAsMzQsMjMsMTIyLDE3MCwyMTEsMTU1LDQ2LDE3MiwxMDksMTkxLDE0MywzMiwyMjksOTUsMTkxLDE2Nyw1NSwyMDQsMjQ2LDE2OSw3MSwxMzYsMTczLDE0LDIxNiwxNDYsMTc2LDEwLDE2OSwyMzQsMTA3LDE3NCwxNTEsMTczLDE1NywxMTMsMjMwLDE5NSw2NywzLDQwLDUyLDIsMTQ3LDIxNSwyNDQsODEsMTU1LDIwOSw0MSwxMDcsMTQ5LDEwOCwyMywxNDEsOCwyNDAsMTY4LDE3LDEzLDIxNCwxMDAsNDM="},{"iv":[118,219,254,204,253,176,213,207,14,158,138,129,109,123,6,196],"text":"MjMyLDI5LDM1LDExMSwyMjgsNjgsMTc2LDc3LDExOSw1NiwxODcsMTA5LDcsMTI1LDIzMiwyNSwzMSwyNTAsMTM5LDI1NCwyMjQsMjA2LDEyOCw1NSwyMTIsMjU1LDE2NSw3LDE4NCwxNDMsMjIsMiwxNjgsMzYsMTQwLDI3LDE1NCwxOTEsMjQ1LDE4NCwxNzAsMTY5LDczLDQ3LDkwLDE4OCwxMDUsODIsMTcsMTMsNDUsMTk0LDE3OCwyMTMsNjQsMjIyLDkwLDE1NSwxMzEsMjQxLDE4NywyNSwzNiwyNDAsNTIsODksMTE4LDEwMCwxODQsMTU2LDE0Myw0OSw4Myw5MSwyMzMsMTEzLDE4MywxMDUsMTIwLDIyMiwyMDIsMTQ2LDE2OSwxNDUsODEsMjM5LDEyNywyMjYsMjIzLDEwMywxNzUsMjEsMTYyLDE1MSwxNzcsMjI2LDIwOSwyNSwxOTQsOTgsMTkxLDE3LDI0MCwyMjYsMjIwLDE3MCwyNTIsNywxMzEsODEsMTU5LDE1OCw5LDIxMyw3MywyMDIsMTM0LDIxLDYzLDUzLDI1MCwzMSwxODQsMjUsMTEyLDI1MiwyNDYsNjQsNTEsMTM1LDExNywxNzgsMjIzLDEwMiw1OCwyMjYsMjksMzgsNDAsMjIsMTI4LDI0LDE4NSwyMzQsODMsMjU0LDI4LDI3LDYzLDE1OCw2NCwyMDQsMjI3LDkyLDE0NCw0LDEwNiwxNjcsMTUsMTc5LDUwLDIxMCwxOTcsMTI1LDIxNiwxMzEsMzgsMTg5LDIwLDI0MCwxNTAsMTQ3LDE0OCw3MCwyMjgsMjMzLDgsOTYsMTE1LDkwLDE0OCwyNiwyNTA="}]};
 
const updateServer = async (url, key, newKeyList) => {
  const cryptoKey = key;
  const encryptList = [];

  for ( let i = 0; i < newKeyList.length; i++ ) {
    const iv = getIv();
    const item = JSON.stringify( newKeyList[i] );
    const text =  await encrypt(item, cryptoKey, iv);
    encryptList.push( { iv: Array.from(iv), text } );
  }

  return fetch( url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(encryptList)
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
      updateServer( action.payload.url, action.payload.key, state );
      return [ ...state ];
    default:
      return state;
  }
};

const keySummaryReducer = ( state, action ) => {
  switch ( action.type ) {
    case 'INIT':
      return action.payload;
    case 'ADD':
      return [ ...state, action.payload, state.length ];
    case 'DELETE':
      const keys = [ ...state ];
      const newKeys = keys.filter(element => element.name !== action.payload.name);
      return newKeys;
//    case 'UPDATE_SERVER':
//      updateServer( action.payload.url, action.payload.key, state );
//      return [ ...state ];
    default:
      return state;
  }
};

const App = () => { 
  const [ isAuthenticated, setIsAuthenticated ] = useState( false );
  const [ keyList, updateKeyList ] = useReducer( reducer, [] );
  const [ isFirstTime, setIsFirstTime ] = useState( true );
  const [ keySummary, updateKeySummary ] = useReducer ( keySummaryReducer, [] );

  const decryptKeys = async function manoj(key) {
    const keys = [];
    try {
      for ( let index = 0; index < keyList.length; index++ ) {
        const iv = new Uint8Array(keyList[index].iv);
        const text = keyList[index].text;

        const decText = await decrypt( text, key, iv );
        const {url, name} = JSON.parse(decText);
        keys.push({url, name, index});
      }
      setIsAuthenticated(true);
      updateKeySummary( { type: 'INIT', payload: keys } );
    }
    catch ( err ) {
      setIsAuthenticated(false);
    }
  }

  const encryptKeyReducer = ( state, action ) => {
    switch ( action.type ) {
      case 'UPDATE_KEY':
        const newState = { ...state, encryptKey: action.payload };
        decryptKeys(action.payload);
        return newState;
  
      default:
        return state;
    }
  };
  const [ encryptKey, setEncryptKey ] = useReducer( encryptKeyReducer, {} );

  
  const hostname = window.location.host;
  const url = `http://${ hostname }/data`;

  useEffect( () => {

    fetch( url )
    // Promise.resolve({ "success":"true",  "data":MyData.data })
    // Promise.resolve({ "success":"true",  "data":[] })
    .then( (response) => response.json() )
    .then( ( res ) => {
      if ( res.success ) {
        const keysFromFile = res.data;

        if( keysFromFile.length ) {
          setIsFirstTime( false );
          updateKeyList( { type: 'INIT', payload: keysFromFile } );
        }
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

    updateKeySummary( { type: 'ADD', payload: {url, name} } );
    updateKeyList( { type: 'ADD', payload: payload } );
    updateKeyList( { type: 'UPDATE_SERVER', payload: {url: url, key: encryptKey.encryptKey} } );
  }

  const deleteItemFromList = ( entry ) => {
    updateKeyList( { type: 'DELETE', payload: { name: entry } } );
    updateKeyList( { type: 'UPDATE_SERVER', payload: {url: url, key: encryptKey} } );
  }

  const getDecodedContent = async (index) => {
    const iv = new Uint8Array(keyList[index].iv);
    const text = keyList[index].text;
    const decText = await decrypt( text, encryptKey.encryptKey, iv );

    const content = JSON.parse(decText).content;


    return content;
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/add'>
          <AddNewForm 
            isAuthenticated={isAuthenticated} 
            addItemToList={addItemToList}
          />
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
              keySummary.map( (item, index) => (
                <Tile 
                  url={item.url} 
                  name={item.name} 
                  key={item.index}
                  index={item.index}
                  delete={deleteItemFromList}
                  content={getDecodedContent}
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
