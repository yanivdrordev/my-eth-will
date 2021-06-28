import { Icon, Table, Input } from 'semantic-ui-react';
import EmailVerificationModal from '../modals/EmailVerificationModal';
import UpdateBeneficiaryAmountModal from '../modals/UpdateBeneficiaryAmountModal';

const BeneficiariesTableRow = ({
  index,
  struct,
  beneficiariesStructs,
  setBeneficiariesStructs,
  onUpdateBeneficiaryAmount
}) => {


  return (
    <Table.Row>
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
            <UpdateBeneficiaryAmountModal
              title="UPDATE BENEFICIARY AMOUNT"
              beneficiariesStructs={beneficiariesStructs}
              index={index}
              setBeneficiariesStructs={setBeneficiariesStructs}
              submitBtnTitle="UPDATE BENEFICIARY AMOUNT"
              onUpdateBeneficiaryAmount={(e) =>
                onUpdateBeneficiaryAmount(e, index)
              }
            ></UpdateBeneficiaryAmountModal>
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
