import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import getWeb3 from '../getWeb3';
import BeneficiariesVault from './../contracts/BeneficiariesVault.json';
import Owner from './Owner';

function WillPage() {
  let { contractAddress } = useParams();

  const [ownerOrBeneficiary, setOwnerOrBeneficiary] = useState(null);

  useEffect(() => {
    const setWeb3AndContract = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        const contract = new web3.eth.Contract(
          BeneficiariesVault.abi,
          contractAddress
        );

        const isOwner = await contract.methods.isOwner().call();

        if (isOwner) {
          setOwnerOrBeneficiary('owner');
        } else {
          //check if account address is Beneficiary address
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
  }, []);

  const isOwnerOrBeneficiary = () => {
    if (ownerOrBeneficiary === 'owner') {
      return <Owner />;
    } else {
      return null;
    }
  };

  if (ownerOrBeneficiary === null) {
    return 'loading';
  } else if (ownerOrBeneficiary === 'owner') {
    return <Owner />;
  }
}

export default WillPage;
