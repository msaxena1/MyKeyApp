import React, { useState } from 'react';
import './App.css'
import Login from './container/login/Login';
import Tile from './components/Tile/Tile';

const content = {
  username: 'Mike',
  password: 'Password123',
  email: 'mike@yahoo.com'
}

const tiles = [
  { url: 'https://www.bankofamerica.com/', name: 'Bank Of America', idx: 0 },
  { url: 'https://www.gmail.com/', name: 'Gmail', idx: 1 },
  { url: 'https://www.facebook.com/', name: 'Facebook', idx: 2 },
  { url: 'https://www.twitter.com/', name: 'Twitter', idx: 3 },
  { url: 'https://www.github.com/', name: 'Github', idx: 4 }
]

const App = () => { 

    return (
      <div>
          <h1>Welcome to MyKepApp</h1>
          <Login />
          { tiles.map( index => (
            <Tile 
              url={index.url} 
              name={index.name} 
              key={index.idx}
              content ={content}
            />
            ) )}
      </div>
    );
}

export default App;
