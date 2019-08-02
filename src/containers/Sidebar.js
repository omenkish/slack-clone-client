import React, { Component } from 'react';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import authenticate from '../utils/authentication';
import AddChannelModal from '../components/AddChannelModal';

export default class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
  }

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false });
  }

  handleAddChannelClick = () => {
    this.setState({ openAddChannelModal: true });
  }

  render() {
    const { teams, team } = this.props;
    const { openAddChannelModal } = this.state;

    const authUser = authenticate();
    return [
      <Teams
        key="team-sidebar"
        teams={teams}
      />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={authUser.username}
        teamId={team.id}
        channels={team.channels}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'User1' }]}
        onAddChannelClick={this.handleAddChannelClick}
      />,
      <AddChannelModal
        teamId={team.id}
        close={this.handleCloseAddChannelModal}
        open={openAddChannelModal}
        key="sidebar-add-channel-modal"
      />,
    ];
  }
}
