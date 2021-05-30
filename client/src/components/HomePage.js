import { useMetaMask } from 'metamask-react';
import React, { useRef, useState } from 'react';

import VaultFactoryContract from './../contracts/VaultFactory.json';
import getWeb3 from '../getWeb3';
import { useHistory } from 'react-router-dom';

function HomePage() {
  const { status, connect, account } = useMetaMask();
  const [factoryContract, setFactoryContract] = useState(null);
  const [vaultContractAddress, setVaultContractAddress] = useState(null);
  const isFirstRender = useRef(true);
  const history = useHistory();

  const createNewVault = async () => {
    // Stores a given value, 5 by default.
    await factoryContract.methods.createNewVault().send({ from: account });

    // Get the value from the contract to prove it worked.
    const contractAddress = await factoryContract.methods
      .getContractAddress()
      .call();

    setVaultContractAddress(contractAddress);
    history.push('/' + contractAddress);
  };

  const setWeb3AndContract = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // // Use web3 to get the user's accounts.
      // const accounts = await web3.eth.getAccounts();

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
  };

  if (status === 'unavailable') return <div>MetaMask not available :(</div>;

  if (status === 'initializing')
    return <div>Synchronisation with MetaMask ongoing...</div>;

  if (status === 'notConnected')
    return <button onClick={connect}>Connect to MetaMask</button>;

  if (status === 'connecting') return <div>Connecting...</div>;

  if (status === 'connected') {
    if (isFirstRender.current) {
      isFirstRender.current = false; // toggle flag after first render/mounting
      setWeb3AndContract();
    }

    return (
      <div>
        <p>contractAddress {vaultContractAddress}</p>
        <button onClick={createNewVault}>set storage to 5</button>
        <div>Connected account: {account}</div>
      </div>
    );
  }

  return null;
}

export default HomePage;
