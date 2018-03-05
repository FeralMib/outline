// @flow
import React, { Component } from 'react';
import invariant from 'invariant';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import Flex from 'shared/components/Flex';
import Avatar from 'components/Avatar';
import { color } from 'shared/styles/constants';

import AuthStore from 'stores/AuthStore';
import ErrorsStore from 'stores/ErrorsStore';
import MemberSettingsStore from 'stores/MemberSettingsStore';
import CenteredContent from 'components/CenteredContent';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import PageTitle from 'components/PageTitle';
import MemberMenu from './components/MemberMenu';

@observer
class Members extends Component {
  props: {
    auth: AuthStore,
    errors: ErrorsStore,
    memberSettings: MemberSettingsStore,
  };

  @observable members;
  @observable isLoaded: boolean = false;

  @observable inviteEmails: string = '';
  @observable isInviting: boolean = false;

  componentDidMount() {
    this.props.memberSettings.fetchUsers();
  }

  render() {
    const user = this.props.auth.user;
    invariant(user, 'User should exist');

    return (
      <CenteredContent>
        <PageTitle title="Members" />
        <h1>Members</h1>

        {!this.props.memberSettings.isLoaded ? (
          <Flex column>
            {this.props.memberSettings.users && (
              <MemberList column>
                {this.props.memberSettings.users.map(member => (
                  <Member key={member.id} justify="space-between" auto>
                    <MemberDetails suspended={member.isSuspended}>
                      <Avatar src={member.avatarUrl} />
                      <UserName>
                        {member.name} {member.email && `(${member.email})`}
                        {member.isAdmin && (
                          <Badge admin={member.isAdmin}>Admin</Badge>
                        )}
                        {member.isSuspended && <Badge>Suspended</Badge>}
                      </UserName>
                    </MemberDetails>
                    <Flex>
                      {user.id !== member.id && <MemberMenu user={member} />}
                    </Flex>
                  </Member>
                ))}
              </MemberList>
            )}
          </Flex>
        ) : (
          <LoadingPlaceholder />
        )}
      </CenteredContent>
    );
  }
}

const MemberList = styled(Flex)`
  border: 1px solid ${color.smoke};
  border-radius: 4px;

  margin-top: 20px;
  margin-bottom: 40px;
`;

const Member = styled(Flex)`
  padding: 10px;
  border-bottom: 1px solid ${color.smoke};
  font-size: 15px;

  &:last-child {
    border-bottom: none;
  }
`;

const MemberDetails = styled(Flex)`
  opacity: ${({ suspended }) => (suspended ? 0.5 : 1)};
`;

const UserName = styled.span`
  padding-left: 8px;
`;

const Badge = styled.span`
  margin-left: 10px;
  padding: 2px 6px;
  background-color: ${({ admin }) => (admin ? color.primary : color.smokeDark)};
  color: ${({ admin }) => (admin ? color.white : color.text)};
  border-radius: 4px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: normal;
`;

export default inject('auth', 'errors', 'memberSettings')(Members);
