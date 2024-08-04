import { observer } from "mobx-react";
import { MoreIcon, QuestionMarkIcon, UserIcon } from "outline-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import Squircle from "@shared/components/Squircle";
import { Pagination } from "@shared/constants";
import { CollectionPermission, IconType } from "@shared/types";
import { determineIconType } from "@shared/utils/icon";
import type Collection from "~/models/Collection";
import type Document from "~/models/Document";
import Share from "~/models/Share";
import Flex from "~/components/Flex";
import LoadingIndicator from "~/components/LoadingIndicator";
import Scrollable from "~/components/Scrollable";
import Text from "~/components/Text";
import useCurrentTeam from "~/hooks/useCurrentTeam";
import useCurrentUser from "~/hooks/useCurrentUser";
import useMaxHeight from "~/hooks/useMaxHeight";
import usePolicy from "~/hooks/usePolicy";
import useRequest from "~/hooks/useRequest";
import useStores from "~/hooks/useStores";
import Avatar from "../../Avatar";
import { AvatarSize } from "../../Avatar/Avatar";
import CollectionIcon from "../../Icons/CollectionIcon";
import Tooltip from "../../Tooltip";
import { Separator } from "../components";
import { ListItem } from "../components/ListItem";
import DocumentMemberList from "./DocumentMemberList";
import PublicAccess from "./PublicAccess";

type Props = {
  /** The document being shared. */
  document: Document;
  /** List of users that have been invited during the current editing session */
  invitedInSession: string[];
  /** The existing share model, if any. */
  share: Share | null | undefined;
  /** The existing share parent model, if any. */
  sharedParent: Share | null | undefined;
  /** Callback fired when the popover requests to be closed. */
  onRequestClose: () => void;
  /** Whether the popover is visible. */
  visible: boolean;
};

export const AccessControlList = observer(
  ({
    document,
    invitedInSession,
    share,
    sharedParent,
    onRequestClose,
    visible,
  }: Props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const collection = document.collection;
    const usersInCollection = useUsersInCollection(collection);
    const user = useCurrentUser();
    const { userMemberships } = useStores();
    const collectionSharingDisabled = document.collection?.sharing === false;
    const team = useCurrentTeam();
    const can = usePolicy(document);

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const { maxHeight, calcMaxHeight } = useMaxHeight({
      elementRef: containerRef,
      maxViewportPercentage: 70,
      margin: 24,
    });

    const {
      loading: loadingDocumentMembers,
      request: fetchDocumentMembers,
      data,
    } = useRequest(
      React.useCallback(
        () =>
          userMemberships.fetchDocumentMemberships({
            id: document.id,
            limit: Pagination.defaultLimit,
          }),
        [userMemberships, document.id]
      )
    );

    React.useEffect(() => {
      void fetchDocumentMembers();
    }, [fetchDocumentMembers]);

    React.useEffect(() => {
      calcMaxHeight();
    });

    if (loadingDocumentMembers) {
      return <LoadingIndicator />;
    }

    if (!data) {
      return null;
    }

    return (
      <ScrollableContainer
        ref={containerRef}
        hiddenScrollbars
        style={{ maxHeight }}
      >
        {collection ? (
          <>
            {collection.permission ? (
              <ListItem
                image={
                  <Squircle color={theme.accent} size={AvatarSize.Medium}>
                    <UserIcon color={theme.accentText} size={16} />
                  </Squircle>
                }
                title={t("All members")}
                subtitle={t("Everyone in the workspace")}
                actions={
                  <AccessTooltip>
                    {collection?.permission === CollectionPermission.ReadWrite
                      ? t("Can edit")
                      : t("Can view")}
                  </AccessTooltip>
                }
              />
            ) : usersInCollection ? (
              <ListItem
                image={<CollectionSquircle collection={collection} />}
                title={collection.name}
                subtitle={t("Everyone in the collection")}
                actions={<AccessTooltip>{t("Can view")}</AccessTooltip>}
              />
            ) : (
              <ListItem
                image={<Avatar model={user} showBorder={false} />}
                title={user.name}
                subtitle={t("You have full access")}
                actions={<AccessTooltip>{t("Can edit")}</AccessTooltip>}
              />
            )}
            <DocumentMemberList
              document={document}
              invitedInSession={invitedInSession}
            />
          </>
        ) : document.isDraft ? (
          <>
            <ListItem
              image={<Avatar model={document.createdBy} showBorder={false} />}
              title={document.createdBy?.name}
              actions={
                <AccessTooltip content={t("Created the document")}>
                  {t("Can edit")}
                </AccessTooltip>
              }
            />
            <DocumentMemberList
              document={document}
              invitedInSession={invitedInSession}
            />
          </>
        ) : (
          <>
            <DocumentMemberList
              document={document}
              invitedInSession={invitedInSession}
            />
            <ListItem
              image={
                <Squircle color={theme.accent} size={AvatarSize.Medium}>
                  <MoreIcon color={theme.accentText} size={16} />
                </Squircle>
              }
              title={t("Other people")}
              subtitle={t("Other workspace members may have access")}
              actions={
                <AccessTooltip
                  content={t(
                    "This document may be shared with more workspace members through a parent document or collection you do not have access to"
                  )}
                />
              }
            />
          </>
        )}
        {team.sharing && can.share && !collectionSharingDisabled && visible && (
          <>
            {document.members.length ? <Separator /> : null}
            <PublicAccess
              document={document}
              share={share}
              sharedParent={sharedParent}
              onRequestClose={onRequestClose}
            />
          </>
        )}
      </ScrollableContainer>
    );
  }
);

const AccessTooltip = ({
  children,
  content,
}: {
  children?: React.ReactNode;
  content?: string;
}) => {
  const { t } = useTranslation();

  return (
    <Flex align="center" gap={2}>
      <Text type="secondary" size="small">
        {children}
      </Text>
      <Tooltip content={content ?? t("Access inherited from collection")}>
        <QuestionMarkIcon size={18} />
      </Tooltip>
    </Flex>
  );
};

const CollectionSquircle = ({ collection }: { collection: Collection }) => {
  const theme = useTheme();
  const iconType = determineIconType(collection.icon)!;
  const squircleColor =
    iconType === IconType.SVG ? collection.color! : theme.slateLight;
  const iconSize = iconType === IconType.SVG ? 16 : 22;

  return (
    <Squircle color={squircleColor} size={AvatarSize.Medium}>
      <CollectionIcon
        collection={collection}
        color={theme.white}
        size={iconSize}
      />
    </Squircle>
  );
};

function useUsersInCollection(collection?: Collection) {
  const { users, memberships } = useStores();
  const { request } = useRequest(() =>
    memberships.fetchPage({ limit: 1, id: collection!.id })
  );

  React.useEffect(() => {
    if (collection && !collection.permission) {
      void request();
    }
  }, [collection]);

  return collection
    ? collection.permission
      ? true
      : users.inCollection(collection.id).length > 1
    : false;
}

const ScrollableContainer = styled(Scrollable)`
  padding: 12px 24px;
  margin: -12px -24px;
`;
