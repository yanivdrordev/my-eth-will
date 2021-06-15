import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Table,
  TextArea,
  Input
} from 'semantic-ui-react';
import AddBeneficiaryModal from './modals/AddBeneficiaryModal';
import EmailVerificationModal from './modals/EmailVerificationModal';
import UpdateBeneficiaryAmountModal from "./modals/UpdateBeneficiaryAmountModal";

const Owner = ({ account, web3, contract, contractAddress }) => {
  const [contractBalance, setContractBalance] = useState(0);
  const [depositeEth, setDepositeEth] = useState(0);
  const [withdrawEth, setWithdrawEth] = useState(0);
  const [newBeneficiary, setNewBeneficiary] = useState({
    address: '',
    email: '',
    name: '',
    amount: 0
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

  const onUpdateBeneficiaryAmount = async (e,index) => {
    e.preventDefault();
    try {
      const res = await contract.methods
        .ow_UpdateBeneficiaryAmount(
          beneficiariesStructs[index].beneficiarAddress,
          web3.utils.toWei(beneficiariesStructs[index].amount, 'ether')
        )
        .send({ from: account });
        console.log(res)
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
        beneficiariesAddresses.map(async (address) => {
          const struct = await contract.methods
            .getBeneficiaryStruct(address)
            .call({ from: account });
          console.log(struct)
          return {
            amount: web3.utils.fromWei(struct.amount, 'ether'),
            beneficiarAddress: struct.beneficiarAddress,
            email: struct.email,
            name: struct.name,
            verifiedAddress: struct.verifiedAddress
          };
        })
      );

      setBeneficiariesStructs(beneficiariesStructs);
    }

    console.log(beneficiariesAddresses);
  };
  //not in use
  const sendVerificationEmailToBeneficiary = (index) => {
    console.log(beneficiariesStructs[index]);
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
      console.log(struct)
      return (
        <Table.Row key={index}>
          <Table.Cell>{struct.name}</Table.Cell>
          <Table.Cell>{struct.email}</Table.Cell>
          <Table.Cell>{struct.beneficiarAddress}</Table.Cell>
          <Table.Cell textAlign="center">
            {struct.verifiedAddress ? (
              <Icon color="green" name="checkmark" size="large" />
            ) : (
              <EmailVerificationModal titleWarning="IF YOU DONT USE GMAIL copy this message and sent it manually">
                <Form>
                  <Form.Field>
                    <label>subject</label>
                    <input value={struct.name + ' verify your address'} />
                  </Form.Field>
                  <Form.Field>
                    <label>message</label>
                    <TextArea
                      style={{ minHeight: 100 }}
                      value={
                        'hi ' +
                        struct.name +
                        ' your etherum account ' +
                        struct.beneficiarAddress +
                        ' was added to my eth will contract. you can go to this website with metamask connect at ' +
                        struct.beneficiarAddress +
                        ' and verify your address http://localhost:3000/' +
                        contractAddress +
                        ' (please note that you need to have a small amount of ETH in this address to pay the gas for the verification)'
                      }
                    />
                  </Form.Field>
                  <a
                    style={{
                      cursor: 'pointer',
                      display: 'inline-block',
                      minHeight: '1em',
                      outline: 0,
                      border: 'none',
                      verticalAlign: 'baseline',
                      backgroundColor: '#2185d0',
                      color: '#fff',
                      fontFamily:
                        'Lato,Helvetica Neue,Arial,Helvetica,sans-serif',
                      fontSize: '1rem',
                      margin: '0 .25em 0 0',
                      padding: '.78571429em 1.5em .78571429em',
                      borderRadius: '.28571429rem',
                    }}
                    href={
                      'https://mail.google.com/mail/?view=cm&fs=1&to=' +
                      struct.email +
                      '&su=' +
                      struct.name +
                      ' verify your address&body=hi ' +
                      struct.name +
                      ' your etherum account ' +
                      struct.beneficiarAddress +
                      ' was added to my eth will contract. you can go to this website with metamask connect at ' +
                      struct.beneficiarAddress +
                      ' and verify your address http://localhost:3000/' +
                      contractAddress +
                      ' (please note that you need to have a small amount of ETH in this address to pay the gas for the verification)'
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="mail" size="large" />
                    send email via gmail
                  </a>
                </Form>
              </EmailVerificationModal>
            )}
          </Table.Cell>
          <Table.Cell>{struct.verifiedAddress ? (
            /* START UPDATE BENEFIARY AMOUNT MODAL FORM */
            <>
            <Input disabled value={struct.amount} />
            <UpdateBeneficiaryAmountModal
              title="UPDATE BENEFICIARY AMOUNT"
              submitBtnTitle="UPDATE BENEFICIARY AMOUNT"
              onUpdateBeneficiaryAmount={(e) => onUpdateBeneficiaryAmount(e,index)}
            >
              <Form>
                <Form.Field>
                  <input
                    placeholder="amount"
                    value={beneficiariesStructs[index].amount}
                    onChange={(e)=> {
                      const temp = [...beneficiariesStructs];
                      temp[index].amount  = e.target.value;
                      return setBeneficiariesStructs(temp);
                    }
                    }
                    name="amount"
                  />
                </Form.Field>
              </Form>
            </UpdateBeneficiaryAmountModal>
            </>
            /* END ADD BENEFICIARY MODAL FORM */
            ) : ( <><Icon name='attention' />need to verified benifiary address first <Input disabled value={struct.amount} /></> )}</Table.Cell>
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
                  <Table.HeaderCell>address</Table.HeaderCell>
                  <Table.HeaderCell>verification status</Table.HeaderCell>
                  <Table.HeaderCell>amount</Table.HeaderCell>
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
