import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Table,
} from 'semantic-ui-react';
import AddBeneficiaryModal from './AddBeneficiaryModal';

const Owner = ({ account, web3, contract, contractAddress }) => {
  const [contractBalance, setContractBalance] = useState(0);
  const [depositeEth, setDepositeEth] = useState(0);
  const [withdrawEth, setWithdrawEth] = useState(0);
  const [newBeneficiary, setNewBeneficiary] = useState({
    address: '',
    email: '',
    name: '',
  });
  const [beneficiariesLength, setBeneficiariesLength] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [beneficiariesStructs, setBeneficiariesStructs] = useState([]);

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

  const onAddBeneficiary = async (e) => {
    e.preventDefault();
    try {
      await contract.methods
        .ow_AddBeneficiary(
          newBeneficiary.address,
          newBeneficiary.email,
          newBeneficiary.name
        )
        .send({ from: account });

      getBeneficiariesLength();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const getContractBalance = async () => {
    const balance = await contract.methods
      .getContractBalance()
      .call({ from: account });

    setContractBalance(balance);
  };

  const getBeneficiariesLength = async () => {
    try {
      const beneficiaries = await contract.methods
        .ow_GetBeneficiariesLength()
        .call({ from: account });

      setBeneficiariesLength(beneficiaries);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleAddBeneficiaryChange = (e) => {
    const { name, value } = e.target;
    setNewBeneficiary((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const parseBeneficiaries = async () => {
    const beneficiariesAddresses = await Promise.all(
      Array(parseInt(beneficiariesLength))
        .fill()
        .map((element, index) => {
          return contract.methods
            .ow_GetBeneficiariesAtIndex(index)
            .call({ from: account });
        })
    );

    if (beneficiariesAddresses) {
      const beneficiariesStructs = await Promise.all(
        beneficiariesAddresses.map((address) => {
          return contract.methods
            .getBeneficiaryStruct(address)
            .call({ from: account });
        })
      );

      setBeneficiariesStructs(beneficiariesStructs);
    }

    console.log(beneficiariesAddresses);
  };

  useEffect(() => {
    getContractBalance();
    getBeneficiariesLength();
    if (beneficiariesLength) {
      parseBeneficiaries();
    }
  }, [beneficiariesLength]);

  const renderRows = () => {
    return beneficiariesStructs.map((struct, index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell>{struct.name}</Table.Cell>
          <Table.Cell>{struct.email}</Table.Cell>
          <Table.Cell textAlign="center">
            {struct.verifiedAddress ? (
              <Icon color="green" name="checkmark" size="large" />
            ) : (
              <Icon color="red" name="x" size="large" />
            )}
          </Table.Cell>
        </Table.Row>
      );
    });
  };

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
            {/* START DEPOSIT FORM */}
            <Form onSubmit={onDeposit}>
              <Form.Field>
                <input
                  value={depositeEth}
                  onChange={(e) => setDepositeEth(e.target.value)}
                />
              </Form.Field>
              <Button type="submit">Deposit</Button>
            </Form>
            {/* END DEPOSIT FORM */}
          </Grid.Column>
          <Grid.Column width={5}>
            {/* START WITHDRAW FORM */}
            <Form onSubmit={onWithdraw} error={!!errorMessage}>
              <Form.Field>
                <input
                  value={withdrawEth}
                  onChange={(e) => setWithdrawEth(e.target.value)}
                />
              </Form.Field>
              <Button type="submit">Withdraw</Button>
            </Form>
            {/* END WITHDRAW FORM */}
          </Grid.Column>
          <Grid.Column width={5}>
            {/* START ADD BENEFICIARY MODAL FORM */}
            <AddBeneficiaryModal
              title="ADD NEW BENEFICIARY"
              submitBtnTitle="ADD NEW BENEFICIARY"
              onAddBeneficiary={onAddBeneficiary}
            >
              <Form>
                <Form.Field>
                  <input
                    placeholder="address"
                    value={newBeneficiary.address}
                    onChange={handleAddBeneficiaryChange}
                    name="address"
                  />
                </Form.Field>
                <Form.Field>
                  <input
                    placeholder="email"
                    value={newBeneficiary.email}
                    onChange={handleAddBeneficiaryChange}
                    name="email"
                  />
                </Form.Field>
                <Form.Field>
                  <input
                    placeholder="name"
                    value={newBeneficiary.name}
                    onChange={handleAddBeneficiaryChange}
                    name="name"
                  />
                </Form.Field>
              </Form>
            </AddBeneficiaryModal>
            {/* END ADD BENEFICIARY MODAL FORM */}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {errorMessage ? (
            <Message error header="Oops!" content={errorMessage} />
          ) : null}
        </Grid.Row>
      </Grid>
      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <div>beneficiariesLength: {beneficiariesLength}</div>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>name</Table.HeaderCell>
                  <Table.HeaderCell>email</Table.HeaderCell>
                  <Table.HeaderCell>verified address</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>{renderRows()}</Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Owner;
