import React, { useContext, useState } from 'react';
import {
  Button,
  Message,
  Modal,
  Form,
  TextArea,
  Icon,
} from 'semantic-ui-react';
import { contractAddressContext } from '../../../context/contractAddress-context';

const EmailVerificationModal = ({ titleWarning, struct }) => {

  const [open, setOpen] = useState(false);
  const {contractAddress} = useContext(contractAddressContext);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>send email</Button>}
    >
      <Modal.Header>
        <Message warning header={titleWarning} />
      </Modal.Header>
      <Modal.Content>
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
              fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif',
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
      </Modal.Content>
    </Modal>
  );
};

export default EmailVerificationModal;
