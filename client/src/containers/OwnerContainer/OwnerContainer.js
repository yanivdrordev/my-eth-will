import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Message
} from 'semantic-ui-react';
import { Web3Context } from '../../context/web3-context';
import AddBeneficiaryModal from './modals/AddBeneficiaryModal';
import BeneficiariesTable from './components/BeneficiariesTable';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';


const OwnerContainer = ({ account, contract, contractAddress }) => {
  const web3 = useContext(Web3Context);
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

  useEffect(() => {
    getContractBalance();
    getBeneficiariesLength();
    if (beneficiariesLength) {
      parseBeneficiaries();
    }
  }, [beneficiariesLength]);


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
            <DepositForm onDeposit={onDeposit} depositeEth={depositeEth} setDepositeEth={setDepositeEth} />
            {/* END DEPOSIT FORM */}
          </Grid.Column>
          <Grid.Column width={5}>
            {/* START WITHDRAW FORM */}
            <WithdrawForm onWithdraw={onWithdraw} withdrawEth={withdrawEth} setWithdrawEth={setWithdrawEth} />
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
            <BeneficiariesTable 
              beneficiariesStructs={beneficiariesStructs}
              contractAddress={contractAddress} 
              onUpdateBeneficiaryAmount={onUpdateBeneficiaryAmount} 
              setBeneficiariesStructs={setBeneficiariesStructs}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default OwnerContainer;
