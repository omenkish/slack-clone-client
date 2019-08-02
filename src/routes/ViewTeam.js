import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';

const ViewTeam = ({ data: { loading, allTeams }, match: { params: { teamId, channelId } } }) => {
  if (loading) return null;
  const teamIndex = teamId ? findIndex(allTeams, ['id', teamId]) : 0;
  const team = allTeams[teamIndex];
  const channelIndex = channelId ? findIndex(team.channels, ['id', channelId]) : 0;
  const channel = team.channels[channelIndex];
  return (
    <AppLayout>
      <Sidebar
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
      />
      <Header channelName={channel.name} />
      <Messages channelId={channel.id}>
        <ul className="message-list">
          <li>First</li>
          <li>Second</li>
        </ul>
      </Messages>

      <SendMessage channelname={channel.name} />
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
