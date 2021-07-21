import { useEffect, useState } from 'react';
import { Button, Dimmer, Loader, Segment } from 'semantic-ui-react';

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

  const withdraw =  async () => {
    try {
      await contract.methods.be_Withdraw().send({ from: account });

      bussinessLogic();
    } catch (err) {
      console.log(err);
    }
  };

  const getAPIcalls = async () => {
    return Promise.all([
      await contract.methods
        .getBeneficiaryStruct(account)
        .call({ from: account }),
      await contract.methods.isWithdrawAllowed().call({ from: account }),
      await contract.methods.getDeadlineTimestamp().call({ from: account }),
    ]);
  };

  const bussinessLogic = async () => {
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
        } else if (beneficiaryStructRes.verifiedAddress && !beneficiaryStructRes.completed) {
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
  };

  useEffect(() => {
    bussinessLogic();
  }, []);

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
          <Button onClick={verifyBeneficiaryAddress}>
            Verify your adrress
          </Button>
        );
      case 2:
        return (
          <div>
            <h3>address verified</h3>
            <Segment>
              <p>
                the dedline date at the moment is:
                {deadlineTimestamp
                  ? ' ' +
                    new Date(deadlineTimestamp * 1000).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )
                  : null}
                <br />
              </p>
              <p>{daysLeft} days left for you to make a withdraw.</p>
              <p>
                <Button disabled={!isWithdrawAllowed} onClick={withdraw}>ithdraw</Button>
              </p>
            </Segment>
          </div>
        );
        case 3:
          return(
            <div>withdraw completed</div>
          )
      default:
      // code block
    }
  };

  return <div>{renderContent()}</div>;
};

export default BeneficiaryContainer;
