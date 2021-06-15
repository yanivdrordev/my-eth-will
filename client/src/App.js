import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Web3 from 'web3';

import WillPage from './components/WillPage';
import HomePage from './components/HomePage';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useMetaMask } from 'metamask-react';

const web3 = new Web3(Web3.givenProvider);
export const Web3Context = React.createContext(web3);

function App() {
  const { status, connect, account } = useMetaMask();

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
            <HomePage account={account} />
          </Route>
          <Route
            path="/:contractAddress"
            children={<WillPage account={account} />}
          />
        </Switch>
      );
    }
  };

  return (
    <Router>
      <Menu>
        <Menu.Item>
          <Link to="/">Home</Link>
        </Menu.Item>
      </Menu>
      <Container>{renderContent()}</Container>
    </Router>
  );
}

export default App;
