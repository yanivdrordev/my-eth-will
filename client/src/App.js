import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import WillPage from './components/WillPage';
import HomePage from './components/HomePage';
import { Button, Container } from 'semantic-ui-react';
import { useMetaMask } from 'metamask-react';
import Web3 from 'web3';

function App() {
  const { status, connect, account } = useMetaMask();
  const web3 = new Web3(Web3.givenProvider);

  const renderContent = () => {
    if (status === 'unavailable') return <div>MetaMask not available :(</div>;

    if (status === 'initializing')
      return <div>Synchronisation with MetaMask ongoing...</div>;

    if (status === 'notConnected')
      return <Button onClick={connect}>Connect to MetaMask</Button>;

    if (status === 'connecting') return <div>Connecting...</div>;

    if (status === 'connected') {
      return (
        <Switch>
          <Route exact path="/">
            <HomePage
              status={status}
              connect={connect}
              account={account}
              web3={web3}
            />
          </Route>
          <Route path="/:contractAddress" children={<WillPage />} />
        </Switch>
      );
    }
  };

  return (
    <Router>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
      <Container>{renderContent()}</Container>
    </Router>
  );
}

export default App;
