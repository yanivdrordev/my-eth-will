import { useEffect, useState } from 'react';
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react';

const Owner = ({ account, web3, contract, contractAddress }) => {
  const [contractBalance, setContractBalance] = useState(0);
  const [depositeEth, setDepositeEth] = useState(0);
  const [withdrawEth, setWithdrawEth] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const onDeposit = async (e) => {
    e.preventDefault();
    try {
      await web3.eth.sendTransaction({
        from: account,
        to: contractAddress,
        value: web3.utils.toWei(depositeEth, 'ether'),
      });
    } catch (err) {
      setErrorMessage(err.message);
    }

    setDepositeEth(0);
    getContractBalance();
  };

  const onWithdraw = async (e) => {
    e.preventDefault();

    try {
      await contract.methods
        .ow_Withdraw(web3.utils.toWei(withdrawEth, 'ether'))
        .send({ from: account });
    } catch (err) {
      setErrorMessage(err.message);
    }

    setWithdrawEth(0);
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
    <div onClick={() => setErrorMessage('')}>
      <Grid>
        <Grid.Column floated="left" width={5}>
          <Header as="h1">hello contract owner</Header>
        </Grid.Column>
        <Grid.Column floated="right" width={5}>
          <Header as="h2">
            balance: {web3.utils.fromWei(contractBalance.toString(), 'ether')}
          </Header>
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <Form onSubmit={onDeposit}>
              <Form.Field>
                <input
                  value={depositeEth}
                  onChange={(e) => setDepositeEth(e.target.value)}
                  label="ether"
                  labelPosition="right"
                />
              </Form.Field>
              <Button type="submit">Deposit</Button>
            </Form>
          </Grid.Column>
          <Grid.Column width={5}>
            <Form onSubmit={onWithdraw} error={!!errorMessage}>
              <Form.Field>
                <input
                  value={withdrawEth}
                  onChange={(e) => setWithdrawEth(e.target.value)}
                  label="ether"
                  labelPosition="right"
                />
              </Form.Field>
              <Button type="submit">Withdraw</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {errorMessage ? (
            <Message error header="Oops!" content={errorMessage} />
          ) : null}
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Owner;
