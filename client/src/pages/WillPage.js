import React, { useContext, useEffect , useState } from 'react';
import { useParams } from 'react-router-dom';

import BeneficiariesVault from './../abi/BeneficiariesVault.json';
import BeneficiaryContainer from '../containers/BeneficiaryContainer/BeneficiaryContainer';
import Owner from '../containers/OwnerContainer/OwnerContainer';
import { Web3Context } from './../context/web3-context';
import { contractAddressContext } from './../context/contractAddress-context';

const WillPage = ({ account }) => {

  const web3 = useContext(Web3Context);
  
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
  }, [account,contractAddress ,web3.eth.Contract]);

  if (ownerOrBeneficiary === '') {
    return 'loading';
  } else if (ownerOrBeneficiary === 'owner') {
    return (
      <contractAddressContext.Provider value = {{contractAddress}}>
      <Owner
        account={account}
        contract={contract}
      />
      </contractAddressContext.Provider>
    );
  } else if (ownerOrBeneficiary === 'beneficiary') {
    return (
      <BeneficiaryContainer
        account={account}
        contract={contract}
        contractAddress={contractAddress}
      />
    );
  } else if (ownerOrBeneficiary === 'not-authorized') {
    return 'you are not authorized to see this contract';
  }
}

export default WillPage;