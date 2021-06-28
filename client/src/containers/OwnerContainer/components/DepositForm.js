import {
  Button,
  Form,
} from 'semantic-ui-react';

const DepositForm = ({onDeposit,depositeEth,setDepositeEth}) => {
  return (
    <Form onSubmit={onDeposit}>
    <Form.Field>
      <input
        value={depositeEth}
        onChange={(e) => setDepositeEth(e.target.value)}
      />
    </Form.Field>
    <Button type="submit">Deposit</Button>
  </Form>
  )
}

export default DepositForm;