import { observer } from "mobx-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { MenuButton, useMenuState } from "reakit/Menu";
import ContextMenu from "~/components/ContextMenu";
import Template from "~/components/ContextMenu/Template";
import { navigateToSettings, logout } from "~/actions/definitions/navigation";
import { createTeam, createTeamsList } from "~/actions/definitions/teams";
import usePrevious from "~/hooks/usePrevious";
import useStores from "~/hooks/useStores";
import separator from "~/menus/separator";

const OrganizationMenu: React.FC = ({ children }) => {
  const menu = useMenuState({
    unstable_offset: [4, -4],
    placement: "bottom-start",
    modal: true,
  });
  const stores = useStores();
  const { theme } = stores.ui;
  const previousTheme = usePrevious(theme);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (theme !== previousTheme) {
      menu.hide();
    }
  }, [menu, theme, previousTheme]);

  // NOTE: it's useful to memoize on the team id and session because the action
  // menu is not cached at all.
  const actions = React.useMemo(() => {
    return [
      ...createTeamsList({ stores }),
      createTeam,
      separator(),
      navigateToSettings,
      logout,
    ];
  }, [stores]);

  return (
    <>
      <MenuButton {...menu}>{children}</MenuButton>
      <ContextMenu {...menu} aria-label={t("Account")}>
        <Template {...menu} items={undefined} actions={actions} />
      </ContextMenu>
    </>
  );
};

export default observer(OrganizationMenu);
