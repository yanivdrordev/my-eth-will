import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import getWeb3 from '../getWeb3';
import BeneficiariesVault from './../contracts/BeneficiariesVault.json';
import Owner from './Owner';

function WillPage({ account, web3 }) {
  let { contractAddress } = useParams();

  const [ownerOrBeneficiary, setOwnerOrBeneficiary] = useState(null);

  useEffect(() => {
    const setWeb3AndContract = async () => {
      try {
        // Get network provider and web3 instance.

        const contract = new web3.eth.Contract(
          BeneficiariesVault.abi,
          contractAddress
        );

        const isOwner = await contract.methods
          .isOwner()
          .call({ from: account });

        if (isOwner) {
          setOwnerOrBeneficiary('owner');
        } else {
          //check if account address is Beneficiary address
          setOwnerOrBeneficiary(null);
        }
        console.log(isOwner);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    setWeb3AndContract();
  }, [account]);

  if (ownerOrBeneficiary === null) {
    return 'loading';
  } else if (ownerOrBeneficiary === 'owner') {
    return <Owner account={account} web3={web3} />;
  }
}

export default WillPage;
