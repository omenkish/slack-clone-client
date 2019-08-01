import React from 'react';
import styled from 'styled-components';

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
  text-transform: capitalize;
`;

const SidebarList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const paddingLeft = 'padding-left: 10px';

const SidebarListItem = styled.li`
  padding: 3px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;

const SideBarListHeader = styled.li`${paddingLeft}`;
const PushLeft = styled.div`${paddingLeft}`;
const Green = styled.span`
  color: #00FF00;
  font-size: 20px;
  `;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : 'o');
const channel = ({ id, name }) => <SidebarListItem key={`channel-${id}`}># {name}</SidebarListItem>;
const user = ({ id, name }) => (
  <SidebarListItem key={`user-${id}`}>
    <Bubble /> {name}
  </SidebarListItem>
);

export default ({
  teamName, username, channels, users,
}) => (
  <ChannelWrapper>
    <PushLeft>
      <TeamNameHeader>{teamName}</TeamNameHeader>
      {username}
    </PushLeft>
    <div>
      <SidebarList>
        <SideBarListHeader>Channels</SideBarListHeader>
        {!!channels.length && channels.map(channel)}
      </SidebarList>
    </div>
    <div>
      <SidebarList>
        <SideBarListHeader>Direct Messages</SideBarListHeader>
        {users.map(user)}
      </SidebarList>
    </div>
  </ChannelWrapper>
);
