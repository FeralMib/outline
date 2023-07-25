import * as React from "react";
import styled from "styled-components";
import Img from "@shared/editor/components/Img";
import Flex from "~/components/Flex";
import {
  Preview,
  Title,
  Description,
  Card,
  CardContent,
  CARD_WIDTH,
  THUMBNAIL_HEIGHT,
} from "./Components";

type Props = {
  /** Link url */
  url: string;
  /** Title for the preview card */
  title: string;
  /** Url for thumbnail served by the link provider*/
  thumbnailUrl: string;
  /** Some description about the link provider */
  description: string;
};

function HoverPreviewLink({ url, thumbnailUrl, title, description }: Props) {
  return (
    <Preview to={{ pathname: url }} target="_blank" rel="noopener noreferrer">
      <Flex column>
        {thumbnailUrl ? <Thumbnail src={thumbnailUrl} alt={""} /> : null}
        <Card>
          <CardContent>
            <Flex column>
              <Title>{title}</Title>
              <Description>{description}</Description>
            </Flex>
          </CardContent>
        </Card>
      </Flex>
    </Preview>
  );
}

const Thumbnail = styled(Img)`
  object-fit: cover;
  max-width: ${CARD_WIDTH}px;
  height: ${THUMBNAIL_HEIGHT}px;
`;

export default HoverPreviewLink;
