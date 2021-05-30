import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { useMetaMask } from 'metamask-react';
import { useState, useRef } from 'react';
import VaultFactoryContract from './contracts/VaultFactory.json';

import getWeb3 from './getWeb3';
import WillPage from './components/WillPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {/* <li>
            <Link to={'/' + contractAddress}>contractAddress</Link>
          </li> */}
      </ul>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/:contractAddress" children={<WillPage />} />
      </Switch>
    </Router>
  );
}

export default App;
