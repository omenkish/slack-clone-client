import React from 'react';
import { compose, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import DirectMessageContainer from '../containers/DirectMessageContainer';
import { meQuery } from '../graphql/team';

const DirectMessages = (
  {
    mutate,
    data: { loading, me },
    match: { params: { teamId, userId } },
  },
) => {
  if (loading) return null;
  const { teams, username } = me;
  if (!teams.length) {
    return (<Redirect to="/create-team" />);
  }

  const teamIndex = teamId ? findIndex(teams, ['id', teamId]) : 0;
  const team = teamIndex === -1 ? teams[0] : teams[teamIndex];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        username={username}
      />
      <Header channelName="Someone's username" />
      <DirectMessageContainer teamId={teamId} userId={userId} />
      <SendMessage
        onSubmit={async (text) => {
          const response = await mutate({
            variables: {
              text,
              receiverId: userId,
              teamId,
            },
          });
          console.log('response :', response);
        }}
        placeholder={userId}
      />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: ID!, $text: String!, $teamId: ID!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;
export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(DirectMessages);
