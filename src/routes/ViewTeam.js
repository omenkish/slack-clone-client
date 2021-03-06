import React from 'react';
import { compose, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import MessageContainer from '../containers/MessageContainer';
import { meQuery } from '../graphql/team';

const ViewTeam = (
  {
    mutate,
    data: { loading, me },
    match: { params: { teamId, channelId } },
  },
) => {
  if (loading) return null;

  const { teams, username } = me;
  // const teams = allTeams.concat(
  //   inviteTeams.filter(s => !allTeams.find(t => t.id === s.id)), // end filter
  // );
  // const teams = [...allTeams, ...inviteTeams];
  if (!teams.length) {
    return (<Redirect to="/create-team" />);
  }

  const teamIndex = teamId ? findIndex(teams, ['id', teamId]) : 0;
  const team = teamIndex === -1 ? teams[0] : teams[teamIndex];
  const channelIndex = channelId ? findIndex(team.channels, ['id', channelId]) : 0;
  const channel = channelIndex === -1 ? team.channels[0] : team.channels[channelIndex];
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
      {channel && <Header channelName={channel.name} />}
      {channel && <MessageContainer channelId={channel.id} />}
      {channel && (
        <SendMessage
          placeholder={channel.name}
          onSubmit={async (text) => {
            await mutate({ variables: { text, channelId: channel.id } });
          }}
        />
      )}
    </AppLayout>
  );
};

const createMessageMutation = gql`
  mutation($channelId: ID!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createMessageMutation),
)(ViewTeam);
