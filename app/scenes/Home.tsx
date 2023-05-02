import { observer } from "mobx-react";
import { HomeIcon } from "outline-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Switch, Route } from "react-router-dom";
import { Action } from "~/components/Actions";
import Empty from "~/components/Empty";
import Heading from "~/components/Heading";
import Subheading from "~/components/Subheading";
import List from "~/components/List";
import ListItem from "~/components/Toast";
import Link from "~/components/Branding";
import Text from "~/components/Text";
import InputSearchPage from "~/components/InputSearchPage";
import LanguagePrompt from "~/components/LanguagePrompt";
import PaginatedDocumentList from "~/components/PaginatedDocumentList";
import PinnedDocuments from "~/components/PinnedDocuments";
import Scene from "~/components/Scene";
import Tab from "~/components/Tab";
import Tabs from "~/components/Tabs";
import useCurrentTeam from "~/hooks/useCurrentTeam";
import useCurrentUser from "~/hooks/useCurrentUser";
import usePolicy from "~/hooks/usePolicy";
import useStores from "~/hooks/useStores";
import NewDocumentMenu from "~/menus/NewDocumentMenu";

function Home() {
  const { documents, pins, ui } = useStores();
  const team = useCurrentTeam();
  const user = useCurrentUser();
  const userId = user?.id;
  const { t } = useTranslation();

  React.useEffect(() => {
    pins.fetchPage();
  }, [pins]);

  const canManageTeam = usePolicy(team.id).manage;

  return (
    <Scene
      icon={<HomeIcon color="currentColor" />}
      title={t("MIB2 Wiki Home")}
      actions={
        <>
          <Action>
            <InputSearchPage source="dashboard" label={t("Search documents")} />
          </Action>
          <Action>
            <NewDocumentMenu />
          </Action>
        </>
      }
    >
      {!ui.languagePromptDismissed && <LanguagePrompt />}
      <Heading>{t("MIB2 Wiki")}</Heading>
      <Subheading>
        Welcome to VAG MIB2 Wiki
      </Subheading>
      <Text>
        Share your knowledge with fellow VAG-Heads to collectively build on the newest hacks or solutions.
      </Text>
      <Text>
        At the moment we are mostly focused on MIB solutions but this should be considered an open board to share knowledge about our favourite VAG cars.
      </Text>
      <Text>
        To discuss anything on this board get in touch on either:
      </Text>
      <ul>
        <li>
          Telegram: <a href="https://t.me/joinchat/T_pADdwJyUXq0VoH">https://t.me/joinchat/T_pADdwJyUXq0VoH</a>
        </li>
        <li>
          Discord: <a href="https://discord.gg/YU3rjatWjT">https://discord.gg/YU3rjatWjT</a>
        </li>
      </ul>
      <PinnedDocuments pins={pins.home} canUpdate={canManageTeam} />
      <Tabs>
        <Tab to="/home" exact>
          {t("Recently viewed")}
        </Tab>
        <Tab to="/home/recent" exact>
          {t("Recently updated")}
        </Tab>
        <Tab to="/home/created">{t("Created by me")}</Tab>
      </Tabs>
      <Switch>
        <Route path="/home/recent">
          <PaginatedDocumentList
            documents={documents.recentlyUpdated}
            fetch={documents.fetchRecentlyUpdated}
            empty={<Empty>{t("Weird, this shouldn’t ever be empty")}</Empty>}
            showCollection
          />
        </Route>
        <Route path="/home/created">
          <PaginatedDocumentList
            key="created"
            documents={documents.createdByUser(userId)}
            fetch={documents.fetchOwned}
            options={{
              user: userId,
            }}
            empty={<Empty>{t("You haven’t created any documents yet")}</Empty>}
            showCollection
          />
        </Route>
        <Route path="/home">
          <PaginatedDocumentList
            key="recent"
            documents={documents.recentlyViewed}
            fetch={documents.fetchRecentlyViewed}
            empty={
              <Empty>
                {t(
                  "Documents you’ve recently viewed will be here for easy access"
                )}
              </Empty>
            }
            showCollection
          />
        </Route>
      </Switch>
    </Scene>
  );
}

export default observer(Home);
