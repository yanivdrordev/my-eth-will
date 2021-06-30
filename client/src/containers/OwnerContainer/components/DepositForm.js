import { Button, Form, Icon } from 'semantic-ui-react';

const DepositForm = ({ onDeposit, depositeEth, setDepositeEth }) => {
  return (
    <Form onSubmit={onDeposit}>
      <Form.Field>
        <input
          value={depositeEth}
          onChange={(e) => setDepositeEth(e.target.value)}
        />
      </Form.Field>
      <Button type="submit" icon>
        <Icon.Group size="large">
          <Icon name="ethereum" />
          <Icon corner="bottom right" name="add" />
        </Icon.Group>
        Deposit
      </Button>
    </Form>
  );
};

export default DepositForm;
