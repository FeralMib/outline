import * as React from "react";
import Avatar from "~/components/Avatar";
import { AvatarSize } from "~/components/Avatar/Avatar";
import Flex from "~/components/Flex";
import { Preview, Title, Info } from "./Components";

type Props = {
  /** Resource url, avatar url in case of user mention */
  url: string;
  /** Title for the preview card*/
  title: string;
  /** Info about mentioned user's recent activity */
  info: string;
  /** Used for avatar's background color in absence of avatar url */
  color: string;
};

function HoverPreviewMention({ url, title, info, color }: Props) {
  return (
    <Preview to="">
      <Flex gap={12}>
        <Avatar
          model={{
            avatarUrl: url,
            initial: title ? title[0] : "?",
            color,
          }}
          size={AvatarSize.XLarge}
        />
        <Flex column>
          <Title>{title}</Title>
          <Info>{info}</Info>
        </Flex>
      </Flex>
    </Preview>
  );
}

export default HoverPreviewMention;
