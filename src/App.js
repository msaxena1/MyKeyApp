import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './App.css'
import Login from './container/login/Login';
import Tile from './components/Tile/Tile';
import Button from './components/Button/Button';
import AddNewForm from './components/AddNewForm/AddNewForm'; 
import { getIv, encrypt, decrypt } from './crypto';

const hostname = window.location.host;
const url = `https://${ hostname }/data`;

const saveEncryptedKeys = async (newKeyList) => {
  return fetch( url, {
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
  .catch( (err) => console.log('Failed to save encrypted keys') );
}

const encryptedKeysReducer = ( state, action ) => {
  switch ( action.type ) {
    case 'INIT':
      return action.payload;
    case 'ADD':
      const newKeys = [ ...state, action.payload ];
      saveEncryptedKeys( newKeys );
      return newKeys;
    case 'DELETE':
      const keys = [ ...state ];
      keys.splice(action.payload.index, 1);
      saveEncryptedKeys( keys );
      return keys;
    default:
      return state;
  }
};

const keySummaryReducer = ( state, action ) => {
  switch ( action.type ) {
    case 'INIT':
      return action.payload;
    case 'ADD':
      return [ ...state, action.payload ];
    case 'DELETE':
      const keys = [ ...state ];
      const newKeys = keys.filter(element => element.name !== action.payload.name);
      newKeys.forEach( (entry, index) => entry.index = index );
      return newKeys;

    default:
      return state;
  }
};

const App = () => { 
  const [ isAuthenticated, setIsAuthenticated ] = useState( false );
  const [ keyList, updateKeyList ] = useReducer( encryptedKeysReducer, [] );
  const [ isFirstTime, setIsFirstTime ] = useState( true );
  const [ keySummary, updateKeySummary ] = useReducer ( keySummaryReducer, [] );

  const getKeysSummary = async (key) => {
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

  const addNewKeyToEncryptedList = async ( item, cryptoKey ) => {
      const iv = getIv();
      const text =  await encrypt(JSON.stringify(item), cryptoKey, iv);
      updateKeyList( { type: 'ADD', payload: { iv: Array.from(iv), text } } );
  }

  const encryptKeyReducer = ( state, action ) => {
    switch ( action.type ) {
      case 'UPDATE_KEY':
        const newState = { ...state, encryptKey: action.payload };
        getKeysSummary(action.payload);
        return newState;
  
      default:
        return state;
    }
  };

  const [ encryptKey, setEncryptKey ] = useReducer( encryptKeyReducer, {} );


  useEffect( () => {

    fetch( url )
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

    updateKeySummary( { type: 'ADD', payload: {
      url:entry.addr, 
      name: entry.desc, 
      index: keySummary.length
    } } );
    addNewKeyToEncryptedList( payload, encryptKey.encryptKey );
  }

  const deleteItemFromList = ( entry, index ) => {
    updateKeySummary( { type: 'DELETE', payload: { name: entry } } );
    updateKeyList( { type: 'DELETE', payload: { index: index } } );
  }

  const getItemContentAtIndex = async (index) => {
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
              keySummary.map( (item) => (
                <Tile 
                  url={item.url} 
                  name={item.name} 
                  key={item.index}
                  index={item.index}
                  delete={deleteItemFromList}
                  content={getItemContentAtIndex}
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
