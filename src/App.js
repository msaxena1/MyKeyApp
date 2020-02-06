import React, { useContext, useEffect, useReducer } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './App.css'
import Login from './container/login/Login';
import Tile from './components/Tile/Tile';
import Button from './components/Button/Button';
import AddNewForm from './components/AddNewForm/AddNewForm'; 
import { AuthenticationContext } from './store/Store';
 
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

    const [ keyList, updateKeyList ] = useReducer( reducer, [] );

    useEffect( () => {
      Promise.resolve() // fetch()
      .then( () => {
        const keysFromFile = [

        ];

        updateKeyList( { type: 'INIT', payload: keysFromFile } );
      } )
      .catch( (err) => console.log(err) );
    }, [] );

    const addItemToList = ( entry ) => {
      if ( !entry.addr.startsWith('http') ) {
        entry.addr = 'https://'+ entry.addr;
      }
      updateKeyList( { type: 'ADD', payload: {
        url: entry.addr, 
        name: entry.desc,
        content: {
          username: entry.user,
          password: entry.pwd,
          email: entry.email,
          phone: entry.phone,
          misc: entry.misc
        }
      } } );
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
