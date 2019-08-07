import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  padding: 20px;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  channelname,
  values,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
}) => (
  <SendMessageWrapper>
    <Input
      onKeyDown={(e) => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      name="message"
      value={values.message}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={`Message #${channelname}`}
      fluid
    />
  </SendMessageWrapper>
);

const createMessageMutation = gql`
  mutation($channelId: ID!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;
export default compose(
  graphql(createMessageMutation),
  withFormik({
    mapPropsToValues: () => ({ message: '' }),

    handleSubmit: async (values, { props: { channelId, mutate }, resetForm, setSubmitting }) => {
      if (!values.message || !values.message.trim()) {
        setSubmitting(false);
        return;
      }
      await mutate({
        variables: { channelId, text: values.message },
      });
      resetForm(false);
    },
  }),
)(SendMessage);
