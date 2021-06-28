import React, { useState } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';

const UpdateBeneficiaryAmountModal = ({
  title,
  beneficiariesStructs,
  index,
  setBeneficiariesStructs,
  submitBtnTitle,
  onUpdateBeneficiaryAmount,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Update Amount</Button>}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <input
              placeholder="amount"
              value={beneficiariesStructs[index].amount}
              onChange={(e) => {
                const temp = [...beneficiariesStructs];
                temp[index].amount = e.target.value;
                return setBeneficiariesStructs(temp);
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
            onUpdateBeneficiaryAmount(e);
            setOpen(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default UpdateBeneficiaryAmountModal;
