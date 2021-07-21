import { useContext, useEffect, useState, useCallback } from 'react';
import { Grid, Header, List, Message, Segment } from 'semantic-ui-react';
import { Web3Context } from '../../context/web3-context';
import BeneficiariesTable from './components/BeneficiariesTable';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';
import { contractAddressContext } from '../../context/contractAddress-context';

const OwnerContainer = ({ account, contract }) => {
  const web3 = useContext(Web3Context);
  const { contractAddress } = useContext(contractAddressContext);
  const [contractBalance, setContractBalance] = useState(0);
  const [unassignAmount, setUnassignAmount] = useState(0);
  const [depositeEth, setDepositeEth] = useState(0);
  const [withdrawEth, setWithdrawEth] = useState(0);
  const [newBeneficiary, setNewBeneficiary] = useState({
    address: '',
    email: '',
    name: '',
    amount: 0,
  });
  const [beneficiariesLength, setBeneficiariesLength] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [beneficiariesStructs, setBeneficiariesStructs] = useState([]);
  const [deadlineTimestamp, setDeadlineTimestamp] = useState(0);

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
    await getOwnerPageSummary();
    setDepositeEth(0);
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
    await getOwnerPageSummary();
    setWithdrawEth(0);
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
      await getOwnerPageSummary();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const onUpdateBeneficiaryAmount = async (e, index, amount) => {
    e.preventDefault();
    try {
      const res = await contract.methods
        .ow_UpdateBeneficiaryAmount(
          beneficiariesStructs[index].beneficiarAddress,
          web3.utils.toWei(amount, 'ether')
        )
        .send({ from: account });
      await getOwnerPageSummary();
      return res;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const onDeleteBeneficiary = async (e, index) => {
    e.preventDefault();
    try {
      const res = await contract.methods
        .ow_RemoveBeneficiary(beneficiariesStructs[index].beneficiarAddress)
        .send({ from: account });

      await getOwnerPageSummary();
      return res;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const getOwnerPageSummary = useCallback(async () => {
    try {
      const summary = await contract.methods
        .ow_GetOwnerPageSummary()
        .call({ from: account });
      // summary[0] = getContractBalance(),
      // summary[1] = ow_GetUnassignAmount(),
      // summary[2] =ow_GetBeneficiariesLength()
      // summary[3] = getDeadlineTimestamp()

      setContractBalance(summary[0]);
      setUnassignAmount(summary[1]);
      setBeneficiariesLength(+summary[2]);
      setDeadlineTimestamp(summary[3]);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, []);

  const handleAddBeneficiaryChange = (e) => {
    const { name, value } = e.target;
    setNewBeneficiary((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const parseBeneficiaries = useCallback(async () => {
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
          console.log(struct);
          return {
            amount: web3.utils.fromWei(struct.amount, 'ether'),
            beneficiarAddress: struct.beneficiarAddress,
            email: struct.email,
            name: struct.name,
            verifiedAddress: struct.verifiedAddress,
          };
        })
      );

      setBeneficiariesStructs(beneficiariesStructs);
    }

    console.log(beneficiariesAddresses);
  }, [beneficiariesLength]);

  useEffect(() => {
    getOwnerPageSummary();
  }, [getOwnerPageSummary]);

  useEffect(() => {
    parseBeneficiaries();
  }, [parseBeneficiaries]);

  return (
    <div onClick={() => setErrorMessage('')}>
      <Grid>
        <Grid.Column floated="left" width={12}>
          <Header as="h1">Hello Contract Owner <span style={{fontSize:'1.5rem'}}>{contractAddress}</span></Header>
        </Grid.Column>
        <Grid.Column floated="right" width={4}>
          <Header as="h2">
            <Segment inverted>
              <List divided inverted relaxed>
                <List.Item>
                  <List.Content>
                    balance :{' '}
                    {web3.utils.fromWei(contractBalance.toString(), 'ether') +
                      ' ETH'}
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    unassign amount :{' '}
                    {web3.utils.fromWei(unassignAmount.toString(), 'ether') +
                      ' ETH'}
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    deadline :
                    { deadlineTimestamp
                      ? ' ' + new Date(deadlineTimestamp * 1000).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )
                      : null}
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
          </Header>
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            {/* START DEPOSIT FORM */}
            <DepositForm
              onDeposit={onDeposit}
              depositeEth={depositeEth}
              setDepositeEth={setDepositeEth}
            />
            {/* END DEPOSIT FORM */}
          </Grid.Column>
          <Grid.Column width={5}>
            {/* START WITHDRAW FORM */}
            {contractBalance > 0 ? (
              <WithdrawForm
                onWithdraw={onWithdraw}
                withdrawEth={withdrawEth}
                setWithdrawEth={setWithdrawEth}
              />
            ) : null}
            {/* END WITHDRAW FORM */}
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
          <Grid.Column width={16}>
            <BeneficiariesTable
              beneficiariesLength={beneficiariesLength}
              beneficiariesStructs={beneficiariesStructs}
              onUpdateBeneficiaryAmount={onUpdateBeneficiaryAmount}
              setBeneficiariesStructs={setBeneficiariesStructs}
              newBeneficiary={newBeneficiary}
              handleAddBeneficiaryChange={handleAddBeneficiaryChange}
              onAddBeneficiary={onAddBeneficiary}
              onDeleteBeneficiary={onDeleteBeneficiary}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default OwnerContainer;
