import { useCallback, useEffect, useState } from 'react';
import { Button, Dimmer, Icon, Loader, Segment, Step } from 'semantic-ui-react';

const BeneficiaryContainer = ({ account, contract, contractAddress }) => {
  const [verifiedAddress, setVerifiedAddress] = useState(null);
  const [isWithdrawAllowed, setIsWithdrawAllowed] = useState(null);
  const [deadlineTimestamp, setDeadlineTimestamp] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [step, setStep] = useState(0);

  // START UTIL
  const timeDifference = (date1, date2) => {
    const difference = date1.getTime() - date2.getTime();

    const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    setDaysLeft(daysDifference);
  };
  // END UTIL

  const verifyBeneficiaryAddress = async () => {
    try {
      await contract.methods.be_VerifyAddress().send({ from: account });

      bussinessLogic();
    } catch (err) {
      console.log(err);
    }
  };

  const withdraw = async () => {
    try {
      await contract.methods.be_Withdraw().send({ from: account });

      bussinessLogic();
    } catch (err) {
      console.log(err);
    }
  };

  const calcStepsUI = () => {
    return (
      <Step.Group ordered>
        <Step active={step === 1} completed={step > 1}>
          <Step.Content>
            <Step.Title>Address verification</Step.Title>
            <Step.Description>verify your account address</Step.Description>
          </Step.Content>
        </Step>

        <Step active={step === 2} completed={step > 2}>
          <Step.Content>
            <Step.Title>Address verified</Step.Title>
            <Step.Description>
              after you verified your address can watch how many days have left
              <br /> for the contract and the ETH amount assign to you
            </Step.Description>
          </Step.Content>
        </Step>

        <Step active={step === 3} completed={step === 3}>
          <Step.Content>
            <Step.Title>Done</Step.Title>
            <Step.Description>withdraw completed</Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>
    );
  };

  const getAPIcalls = useCallback(async () => {
    return Promise.all([
      await contract.methods
        .getBeneficiaryStruct(account)
        .call({ from: account }),
      await contract.methods.isWithdrawAllowed().call({ from: account }),
      await contract.methods.getDeadlineTimestamp().call({ from: account }),
    ]);
  }, []);

  const bussinessLogic = useCallback(async () => {
    getAPIcalls()
      .then((response) => {
        const [
          beneficiaryStructRes,
          isWithdrawAllowedRes,
          deadlineTimestampRes,
        ] = response;

        setVerifiedAddress(beneficiaryStructRes.verifiedAddress);
        setIsWithdrawAllowed(isWithdrawAllowedRes);
        setDeadlineTimestamp(deadlineTimestampRes);

        if (!beneficiaryStructRes.verifiedAddress) {
          //address not yet verified
          setStep(1);
        } else if (
          beneficiaryStructRes.verifiedAddress &&
          !beneficiaryStructRes.completed
        ) {
          //address verified
          setStep(2);
          timeDifference(new Date(+deadlineTimestampRes * 1000), new Date());
        } else if (beneficiaryStructRes.completed) {
          //withdraw completed
          setStep(3);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [getAPIcalls]);

  useEffect(() => {
    bussinessLogic();
  }, [bussinessLogic]);

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
        );
      case 1:
        return (
          <div>
            {calcStepsUI()}
            <Segment>
              <p>
                <strong>{contractAddress}</strong> contract owner canot assign
                to you any ETH until you will verifiy your address.
                <br /> it will cost you a small amount of gas.
              </p>

              <Button primary onClick={verifyBeneficiaryAddress}>
                Verify your adrress
              </Button>
            </Segment>
          </div>
        );
      case 2:
        return (
          <div>
            <h3>address verified succesfully!</h3>
            {calcStepsUI()}
            <Segment>
              <p>
                {!isWithdrawAllowed
                  ? 'the dedline date at the moment is: ' +
                    new Date(deadlineTimestamp * 1000).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    ) +
                    ' ' +
                    daysLeft +
                    ' days left for you to make a withdraw.'
                  : 'you can withdraw.'}
                <br />
                <Button disabled={!isWithdrawAllowed} onClick={withdraw}>
                  Withdraw
                </Button>
              </p>
            </Segment>
          </div>
        );
      case 3:
        return (
          <div>
            {calcStepsUI()}
            <Segment>withdraw completed</Segment>
          </div>
        );
      default:
      // code block
    }
  };

  return <div>{renderContent()}</div>;
};

export default BeneficiaryContainer;
