import * as React from "react";
import BaseEmail from "./BaseEmail";
import Body from "./components/Body";
import CopyableCode from "./components/CopyableCode";
import EmailTemplate from "./components/EmailLayout";
import EmptySpace from "./components/EmptySpace";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Heading from "./components/Heading";

type Props = {
  to: string;
  deleteConfirmationCode: string;
};

/**
 * Email sent to a user when they request to delete their account.
 */
export default class ConfirmUserDeleteEmail extends BaseEmail<Props> {
  protected subject() {
    return `Your account deletion request`;
  }

  protected preview() {
    return `Your requested account deletion code`;
  }

  protected renderAsText({ deleteConfirmationCode }: Props): string {
    return `
You requested to permanantly delete your Outline account. Please enter the code below to confirm your account deletion.

Code: ${deleteConfirmationCode}
`;
  }

  protected render({ deleteConfirmationCode }: Props) {
    return (
      <EmailTemplate>
        <Header />

        <Body>
          <Heading>Your account deletion request</Heading>
          <p>
            You requested to permanantly delete your Outline account. Please
            enter the code below to confirm your account deletion.
          </p>
          <EmptySpace height={5} />
          <p>
            <CopyableCode>{deleteConfirmationCode}</CopyableCode>
          </p>
        </Body>

        <Footer />
      </EmailTemplate>
    );
  }
}
