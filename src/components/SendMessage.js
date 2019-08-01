import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 16px;
`;

export default ({ channelname }) => (
  <SendMessageWrapper>
    <Input placeholder={`Message #${channelname}`} fluid />
  </SendMessageWrapper>
);
