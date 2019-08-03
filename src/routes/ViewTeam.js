import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';

const ViewTeam = (
  { data: { loading, allTeams, inviteTeams }, match: { params: { teamId, channelId } } },
) => {
  if (loading) return null;

  const teams = allTeams.concat(
    inviteTeams.filter(s => !allTeams.find(t => t.id === s.id)), // end filter
  );
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
      />
      {channel && <Header channelName={channel.name} />}
      {channel && (
        <Messages channelId={channel.id}>
          <ul className="message-list">
            <li>First</li>
            <li>Second</li>
          </ul>
        </Messages>
      )}

      {channel && <SendMessage channelname={channel.name} />}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
