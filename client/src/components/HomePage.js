import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import VaultFactoryContract from './../contracts/VaultFactory.json';
import getWeb3 from '../getWeb3';

function HomePage({ status, connect, account, web3 }) {
  const [factoryContract, setFactoryContract] = useState(null);
  const [newContractAddress, setNewContractAddress] = useState(null);
  const history = useHistory();

  const createNewVault = async () => {
    // Stores a given value, 5 by default.
    await factoryContract.methods.createNewVault().send({ from: account });

    // Get the value from the contract to prove it worked.
    const instance = await factoryContract.methods.getContractAddress().call();
    setNewContractAddress(instance);
    history.push('/' + instance);
  };

  // const setWeb3AndContract = async () => {};

  useEffect(() => {
    const renderContent = async () => {
      try {
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VaultFactoryContract.networks[networkId];

        console.log(deployedNetwork.address);

        const instance = new web3.eth.Contract(
          VaultFactoryContract.abi,
          deployedNetwork.address
        );

        setFactoryContract(instance);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }

      // if (isFirstRender.current) {
      //   isFirstRender.current = false; // toggle flag after first render/mounting
      //   return null;
      // }
    };

    renderContent();
  }, []);

  return (
    factoryContract && (
      <div>
        <p>contractAddress {newContractAddress}</p>
        <Button onClick={createNewVault}>Create New Vault</Button>
        <div>Connected account: {account}</div>
      </div>
    )
  );
}

export default HomePage;
