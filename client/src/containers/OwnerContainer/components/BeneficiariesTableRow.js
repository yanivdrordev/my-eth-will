import { Icon, Table, Input, Button } from 'semantic-ui-react';
import EmailVerificationModal from '../modals/EmailVerificationModal';
import UpdateBeneficiaryAmountModal from '../modals/UpdateBeneficiaryAmountModal';
import DeleteBeneficiaryModal from '../modals/DeleteBeneficiaryModal';

const BeneficiariesTableRow = ({
  index,
  struct,
  beneficiariesStructs,
  setBeneficiariesStructs,
  onUpdateBeneficiaryAmount,
  onDeleteBeneficiary,
}) => {
  return (
    <Table.Row>
      <Table.Cell>
        {/* Actions */}
        {struct.verifiedAddress ? (
          <>
            <Button.Group vertical labeled icon>
              <UpdateBeneficiaryAmountModal
                title="UPDATE BENEFICIARY AMOUNT"
                beneficiariesStructs={beneficiariesStructs}
                index={index}
                setBeneficiariesStructs={setBeneficiariesStructs}
                submitBtnTitle="UPDATE BENEFICIARY AMOUNT"
                onUpdateBeneficiaryAmount={(e, index, amount) =>
                  onUpdateBeneficiaryAmount(e, index, amount)
                }
              ></UpdateBeneficiaryAmountModal>
              <DeleteBeneficiaryModal
                title="DELETE BENEFICIARY"
                onDeleteBeneficiary={(e) => onDeleteBeneficiary(e, index)}
              ></DeleteBeneficiaryModal>
            </Button.Group>
          </>
        ) : (
          <Button.Group vertical labeled icon>
            <Button disabled icon labelPosition="left">
              <Icon name="edit" />
              Add/Update Amount
            </Button>
            <DeleteBeneficiaryModal
              title="DELETE BENEFICIARY"
              onDeleteBeneficiary={(e) => onDeleteBeneficiary(e, index)}
            ></DeleteBeneficiaryModal>
          </Button.Group>
        )}
      </Table.Cell>
      <Table.Cell>{struct.name}</Table.Cell>
      <Table.Cell>{struct.email}</Table.Cell>
      <Table.Cell>{struct.beneficiarAddress}</Table.Cell>
      <Table.Cell textAlign="center">
        {struct.verifiedAddress ? (
          <Icon color="green" name="checkmark" size="large" />
        ) : (
          <EmailVerificationModal
            titleWarning="IF YOU DONT USE GMAIL copy this message and sent it manually"
            struct={struct}
          ></EmailVerificationModal>
        )}
      </Table.Cell>
      <Table.Cell>
        {struct.verifiedAddress ? (
          /* START UPDATE BENEFIARY AMOUNT MODAL FORM */
          <>
            <Input disabled value={struct.amount} />
          </>
        ) : (
          /* END ADD BENEFICIARY MODAL FORM */
          <>
            <Icon name="attention" />
            need to verified benifiary address first{' '}
            <Input disabled value={struct.amount} />
          </>
        )}
      </Table.Cell>
    </Table.Row>
  );
};

export default BeneficiariesTableRow;
