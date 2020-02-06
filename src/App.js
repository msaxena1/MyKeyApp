import React, { useContext, useEffect, useReducer } from 'react';
import './App.css'
import Login from './container/login/Login';
import Tile from './components/Tile/Tile';
import Button from './components/Button/Button';
import { AuthenticationContext } from './store/Store';
import AddNewForm from './components/AddNewForm/AddNewForm';  

const content = {
  username: 'Mike',
  password: 'Password123',
  email: 'mike@yahoo.com'
}

const reducer = ( state, action ) => {
  switch ( action.type ) {
    case 'INIT':
      return action.payload;
    case 'ADD':
      return [ ...state, action.payload ];
    case 'DELETE':
      const keys = [ ...state ];
      keys.pop();
      return keys;
    default:
      return state;
  }
};

const App = () => { 
  const authContext = useContext( AuthenticationContext );
  const isAuthenticated = authContext.isAuthenticated;
  console.log( isAuthenticated )

    const [ keyList, updateKeyList ] = useReducer( reducer, [] );

    useEffect( () => {
      Promise.resolve() // fetch()
      .then( () => {
        const keysFromFile = [
          { url: 'https://www.bankofamerica.com/', name: 'Bank Of America' },
          { url: 'https://www.google.com/', name: 'Gmail' },
          { url: 'https://www.facebook.com/', name: 'Facebook' },
          { url: 'https://www.twitter.com/', name: 'Twitter' },
          { url: 'https://www.github.com/', name: 'Github' }
        ];

        updateKeyList( { type: 'INIT', payload: keysFromFile } );
      } )
      .catch( (err) => console.log(err) );
    }, [] );


    return (
      <div>
        <div>
          <h2 align='center'>MyKeyApp </h2>
          { isAuthenticated? <Button name='Add New' /> : null }
          <AddNewForm />
        </div>       
          { !isAuthenticated? (<Login />) : 
            keyList.map( (item, index) => (
              <Tile 
                url={item.url} 
                name={item.name} 
                content={content}
                style={item.style}
                key={index}
              />
              ) ) 
          }
      </div>
    );
}

export default App;
