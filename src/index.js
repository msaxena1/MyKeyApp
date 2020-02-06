import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import AddNewForm from './components/AddNewForm/AddNewForm'; 
import { AuthenticationProvider } from './store/Store'


ReactDOM.render(
  <AuthenticationProvider>
    <BrowserRouter>
    <Switch>
      <Route path='/add'>
        <AddNewForm />
      </Route>
      <Route path='/'>
        <App />
      </Route>
    </Switch>
    </BrowserRouter>
    </AuthenticationProvider>,
  document.getElementById('root')
);
