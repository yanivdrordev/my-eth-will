import { useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';

const Beneficiary = ({ account, web3, contract, contractAddress }) => {
  const [verifiedAddress, setVerifiedAddress] = useState(null);

  const getBeneficiaryStruct = async () => {
    try {
      const beneficiaryStruct = await contract.methods
        .getBeneficiariesStruct(account)
        .call({ from: account });

      setVerifiedAddress(beneficiaryStruct.verifiedAddress);
    } catch (err) {
      console.log(err);
    }
  };

  const verifyBeneficiaryAddress = async () => {
    try {
      await contract.methods.be_VerifyAddress().send({ from: account });

      getBeneficiaryStruct();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBeneficiaryStruct();
  }, []);

  const renderContent = () => {
    if (verifiedAddress === null) {
      return <div>Loading Data ...</div>;
    } else if (verifiedAddress === false) {
      return (
        <Button onClick={verifyBeneficiaryAddress}>Verify your adrress</Button>
      );
    } else if (verifiedAddress === true) {
      return 'your been already verified';
    }
  };

  return <div>{renderContent()}</div>;
};

export default Beneficiary;
