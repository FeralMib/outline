// @flow
import * as React from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import { ExpandedIcon } from 'outline-icons';
import Flex from 'shared/components/Flex';
import TeamLogo from './TeamLogo';

type Props = {
  teamName: string,
  subheading: string,
  logoUrl: string,
};

function HeaderBlock({ teamName, subheading, logoUrl, ...rest }: Props) {
  return (
    <Header justify="flex-start" align="center" {...rest}>
      <TeamLogo src={logoUrl} />
      <Flex align="flex-start" column>
        <TeamName>
          {teamName} <StyledExpandedIcon color={color.text} />
        </TeamName>
        <Subheading>{subheading}</Subheading>
      </Flex>
    </Header>
  );
}

const StyledExpandedIcon = styled(ExpandedIcon)`
  position: relative;
  top: 6px;
  left: -4px;
`;

const Subheading = styled.div`
  padding-left: 10px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 500;
  color: ${color.slateDark};
`;

const TeamName = styled.div`
  padding-left: 10px;
  font-weight: 600;
  color: ${color.text};
  text-decoration: none;
  font-size: 16px;
`;

const Header = styled(Flex)`
  flex-shrink: 0;
  padding: 16px 24px;
  position: relative;
  cursor: pointer;
  width: 100%;

  &:active,
  &:hover {
    transition: background 100ms ease-in-out;
    background: rgba(0, 0, 0, 0.05);
  }
`;

export default HeaderBlock;
