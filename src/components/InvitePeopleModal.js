import React from 'react';
import {
  Modal, Button, Input, Form,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import normalizeErrors from '../utils/normalizeErrors';

const InvitePeopleModal = ({
  open,
  close,
  values,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  touched,
  errors,
}) => (
  <Modal
    open={open}
    onClose={close}
    closeIcon
  >
    <Modal.Header>Add People To Team</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            type="email"
            value={values.name}
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            fluid
            placeholder="User's email"
          />
        </Form.Field>
        {(touched.email && errors.email) && (
          <p>{errors.email[0]}</p>
        )}
        <Form.Group widths="equal">
          <Button fluid onClick={close} disabled={isSubmitting} type="button"> Cancel</Button>
          <Button fluid onClick={handleSubmit} disabled={isSubmitting} type="button"> Add User</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: ID!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;
export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),

    handleSubmit: async (
      values, { props: { teamId, mutate, close }, setSubmitting, setErrors }) => {
      const response = await mutate({
        variables: { teamId, email: values.email },
      });
      const { ok, errors } = response.data.addTeamMember;
      if (ok) {
        close();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        setErrors(normalizeErrors(errors));
      }
    },
  }),
)(InvitePeopleModal);
