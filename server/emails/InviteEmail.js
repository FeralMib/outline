// @flow
import * as React from 'react';
import EmailTemplate from './components/EmailLayout';
import Body from './components/Body';
import Button from './components/Button';
import Heading from './components/Heading';
import Header from './components/Header';
import Footer from './components/Footer';
import EmptySpace from './components/EmptySpace';

export type Props = {
  name: string,
  actorName: string,
  actorEmail: string,
  teamName: string,
  teamUrl: string,
};

export const inviteEmailText = ({
  teamName,
  actorName,
  actorEmail,
  teamUrl,
}: Props) => `
Join ${teamName} on Outline

${actorName} (${
  actorEmail
}) has invited you to join Outline, a place for your team to build and share knowledge.

Join now: ${teamUrl}
`;

export const InviteEmail = ({
  teamName,
  actorName,
  actorEmail,
  teamUrl,
}: Props) => {
  return (
    <EmailTemplate>
      <Header />

      <Body>
        <Heading>Join {teamName} on Outline</Heading>
        <p>
          {actorName} ({actorEmail}) has invited you to join Outline, a place
          for your team to build and share knowledge.
        </p>
        <EmptySpace height={10} />
        <p>
          <Button href={teamUrl}>Join now</Button>
        </p>
      </Body>

      <Footer />
    </EmailTemplate>
  );
};
