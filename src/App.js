import React from 'react';
import './App.css'
import Login from './container/login/Login';

const isAuthenticated = true;

const login = isAuthenticated ? <Login /> : null;

const App = () => { 
    return (
      <div>
          <h1>Welcome to MyKepApp</h1>
          {login}
      </div>
    );
}

export default App;
