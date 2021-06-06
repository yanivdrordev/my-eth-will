import { useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';

const Owner = ({ account, web3, contract, contractAddress }) => {
  const [contractBalance, setContractBalance] = useState(0);

  const deposit = async () => {
    await web3.eth.sendTransaction({
      from: account,
      to: contractAddress,
      value: web3.utils.toWei('0.001', 'ether'),
    });
    getContractBalance();
  };

  const withdraw = async () => {
    const res = await contract.methods
      .ow_Withdraw(web3.utils.toWei('0.001', 'ether'))
      .send({ from: account });
    console.log(res);
    getContractBalance();
  };

  const getContractBalance = async () => {
    const balance = await contract.methods
      .getContractBalance()
      .call({ from: account });
    setContractBalance(balance);
  };

  useEffect(() => {
    getContractBalance();
  }, []);

  return (
    <div>
      <Button onClick={deposit}>Deposit</Button>
      <Button onClick={withdraw}>Withdraw</Button>
      <div>
        balance: {web3.utils.fromWei(contractBalance.toString(), 'ether')}
      </div>
    </div>
  );
};

export default Owner;
