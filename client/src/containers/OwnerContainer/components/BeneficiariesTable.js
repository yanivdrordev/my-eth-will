
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
import EmailVerificationModal from '../modals/EmailVerificationModal';
import UpdateBeneficiaryAmountModal from "../modals/UpdateBeneficiaryAmountModal";

const BeneficiariesTable = ({beneficiariesStructs, contractAddress, onUpdateBeneficiaryAmount, onSetBeneficiariesStructs}) => {

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
                      return onSetBeneficiariesStructs(temp);
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
  )
}

export default BeneficiariesTable;