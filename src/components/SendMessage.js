import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  padding: 20px;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  placeholder,
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
      placeholder={`Message #${placeholder}`}
      fluid
    />
  </SendMessageWrapper>
);

export default withFormik({
  mapPropsToValues: () => ({ message: '' }),

  handleSubmit: async (values, { props: { onSubmit }, resetForm, setSubmitting }) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }

    await onSubmit(values.message);
    resetForm(false);
  },
})(SendMessage);
