import React, { useContext, useEffect, useReducer } from 'react';
import './App.css'
import Login from './container/login/Login';
import Tile from './components/Tile/Tile';
import Button from './components/Button/Button';
import { AuthenticationContext } from './store/Store';

const content = {
  username: 'Mike',
  password: 'Password123',
  email: 'mike@yahoo.com'
}



const divAppName = {
  width: '70%',
  display: 'inline-block'
};

const divNewButton = {
  width: '20%',
  display: 'inline-block',
};

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
          { url: 'https://www.bankofamerica.com/', name: 'Bank Of America', idx: 0 },
          { url: 'https://www.google.com/', name: 'Gmail', idx: 1 },
          { url: 'https://www.facebook.com/', name: 'Facebook', idx: 2 },
          { url: 'https://www.twitter.com/', name: 'Twitter', idx: 3 },
          { url: 'https://www.github.com/', name: 'Github', idx: 4 }
        ];

        updateKeyList( { type: 'INIT', payload: keysFromFile } );
      } )
      .catch( (err) => console.log(err) );
    }, [] );


    return (
      <div>         
          { !isAuthenticated? (<Login />) : 
            keyList.map( index => (
              <Tile 
                url={index.url} 
                name={index.name} 
                key={index.idx}
                content ={content}
              />
              ) ) 
          }
      </div>
    );
}

export default App;
