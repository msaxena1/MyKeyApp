import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

import { AuthenticationProvider } from './store/Store'


ReactDOM.render(
  <AuthenticationProvider>
        <App />
    </AuthenticationProvider>,
  document.getElementById('root')
);
