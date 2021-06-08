import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import getWeb3 from '../getWeb3';
import BeneficiariesVault from './../contracts/BeneficiariesVault.json';
import Beneficiary from './Beneficiary';
import Owner from './Owner';

function WillPage({ account, web3 }) {
  let { contractAddress } = useParams();
  const [ownerOrBeneficiary, setOwnerOrBeneficiary] = useState('');

  const [contract, setContract] = useState({});

  useEffect(() => {
    const getRole = async () => {
      const contract = new web3.eth.Contract(
        BeneficiariesVault.abi,
        contractAddress
      );
      setContract(contract);

      const isOwner = await contract.methods.isOwner().call({ from: account });

      const isBeneficiary = await contract.methods
        .isBeneficiary()
        .call({ from: account });

      if (isOwner) {
        setOwnerOrBeneficiary('owner');
      } else if (isBeneficiary) {
        //check if account address is Beneficiary address
        setOwnerOrBeneficiary('beneficiary');
      } else {
        //account not autorize to see this page
        setOwnerOrBeneficiary('not-authorized');
      }
      console.log(isOwner);
    };

    getRole();
  }, [account]);

  if (ownerOrBeneficiary === '') {
    return 'loading';
  } else if (ownerOrBeneficiary === 'owner') {
    return (
      <Owner
        account={account}
        web3={web3}
        contract={contract}
        contractAddress={contractAddress}
      />
    );
  } else if (ownerOrBeneficiary === 'beneficiary') {
    return (
      <Beneficiary
        account={account}
        web3={web3}
        contract={contract}
        contractAddress={contractAddress}
      />
    );
  } else if (ownerOrBeneficiary === 'not-authorized') {
    return 'you are not authorized to see this contract';
  }
}

export default WillPage;
