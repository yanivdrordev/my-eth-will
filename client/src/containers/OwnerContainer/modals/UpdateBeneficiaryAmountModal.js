import React, { useState } from 'react';
import { Button, Modal, Form, Message, Icon, Grid } from 'semantic-ui-react';

const UpdateBeneficiaryAmountModal = ({
  title,
  beneficiariesStructs,
  index,
  setBeneficiariesStructs,
  submitBtnTitle,
  onUpdateBeneficiaryAmount,
}) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState(
    beneficiariesStructs[index].amount
  );

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => {setOpen(true); setErrorMessage('')}}
      open={open}
      trigger={
        <Button icon labelPosition="left">
          <Icon name="edit" />
          Add/Update Amount
        </Button>
      }
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <input
              placeholder="amount"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              name="amount"
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={submitBtnTitle}
          labelPosition="right"
          icon="checkmark"
          onClick={(e) => {
            onUpdateBeneficiaryAmount(e)
              .then((res) => {
                const temp = [...beneficiariesStructs];
                temp[index].amount = inputValue;
                setBeneficiariesStructs(temp);
                setOpen(false);
              })
              .catch((err) => {
                setErrorMessage(err.toString());
              });
          }}
          positive
        />
        {errorMessage ? (
          <Message error header="Oops!" content={errorMessage} />
        ) : null}
      </Modal.Actions>
    </Modal>
  );
};

export default UpdateBeneficiaryAmountModal;
