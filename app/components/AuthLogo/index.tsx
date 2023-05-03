import * as React from "react";
import styled from "styled-components";
import GoogleLogo from "./GoogleLogo";
import MicrosoftLogo from "./MicrosoftLogo";
import DiscordLogo from "./DiscordLogo";
import SlackLogo from "./SlackLogo";
import TelegramLogo from "./TelegramLogo";

type Props = {
  providerName: string;
  size?: number;
  color?: string;
};

function AuthLogo({ providerName, color, size = 16 }: Props) {
  switch (providerName) {
    case "slack":
      return (
        <Logo>
          <SlackLogo size={size} fill={color} />
        </Logo>
      );

    case "google":
      return (
        <Logo>
          <GoogleLogo size={size} fill={color} />
        </Logo>
      );

    case "discord":
      return (
        <Logo>
          <DiscordLogo size={size} />
        </Logo>
      );

    case "azure":
      return (
        <Logo>
          <MicrosoftLogo size={size} fill={color} />
        </Logo>
      );

      case "telegram":
        return (
          <Logo>
            <TelegramLogo size={size} />
          </Logo>
        );

    default:
      return null;
  }
}

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

export default AuthLogo;
