// @flow
import { observer } from "mobx-react";
import { CollectionIcon } from "outline-icons";
import * as React from "react";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";
import { parseOutlineExport } from "shared/utils/zip";
import Button from "components/Button";
import CenteredContent from "components/CenteredContent";
import HelpText from "components/HelpText";
import Notice from "components/Notice";
import PageTitle from "components/PageTitle";
import VisuallyHidden from "components/VisuallyHidden";
import useCurrentUser from "hooks/useCurrentUser";
import useStores from "hooks/useStores";
import getDataTransferFiles from "utils/getDataTransferFiles";

function ImportExport() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const fileRef = React.useRef();
  const { ui, collections } = useStores();
  const { showToast } = ui;
  const [isLoading, setLoading] = React.useState(false);
  const [isImporting, setImporting] = React.useState(false);
  const [importedDetails, setImported] = React.useState(false);
  const [isExporting, setExporting] = React.useState(false);
  const [file, setFile] = React.useState();
  const [importDetails, setImportDetails] = React.useState();

  const handleImport = React.useCallback(
    async (ev) => {
      setImported(undefined);
      setImporting(true);

      try {
        const { documentCount, collectionCount } = await collections.import(
          file
        );
        showToast(t("Import completed"));
        setImported({ documentCount, collectionCount });
      } catch (err) {
        showToast(err.message);
      } finally {
        if (fileRef.current) {
          fileRef.current.value = "";
        }
        setImporting(false);
        setFile(undefined);
        setImportDetails(undefined);
      }
    },
    [t, file, collections, showToast]
  );

  const handleFilePicked = React.useCallback(async (ev) => {
    ev.preventDefault();

    const files = getDataTransferFiles(ev);
    const file = files[0];
    setFile(file);

    try {
      setImportDetails(await parseOutlineExport(file));
    } catch (err) {
      setImportDetails([]);
    }
  }, []);

  const handlePickFile = React.useCallback(
    (ev) => {
      ev.preventDefault();

      if (fileRef.current) {
        fileRef.current.click();
      }
    },
    [fileRef]
  );

  const handleExport = React.useCallback(
    async (ev: SyntheticEvent<>) => {
      ev.preventDefault();
      setLoading(true);

      try {
        await collections.export();
        setExporting(true);
        showToast(t("Export in progress…"));
      } finally {
        setLoading(false);
      }
    },
    [t, collections, showToast]
  );

  const hasCollections = importDetails
    ? !!importDetails.filter((detail) => detail.type === "collection").length
    : false;
  const hasDocuments = importDetails
    ? !!importDetails.filter((detail) => detail.type === "document").length
    : false;
  const isImportable = hasCollections && hasDocuments;

  return (
    <CenteredContent>
      <PageTitle title={t("Import / Export")} />
      <h1>{t("Import")}</h1>
      <HelpText>
        <Trans>
          It is possible to import a zip file of folders and Markdown files
          previously exported from an Outline instance. Support will soon be
          added for importing from other services.
        </Trans>
      </HelpText>
      <VisuallyHidden>
        <input
          type="file"
          ref={fileRef}
          onChange={handleFilePicked}
          accept="application/zip"
        />
      </VisuallyHidden>
      {importedDetails && (
        <Notice>
          <Trans
            count={importedDetails.documentCount}
            i18nKey="importSuccessful"
          >
            Import successful, {{ count: importedDetails.documentCount }}{" "}
            documents were imported to your knowledge base.
          </Trans>
        </Notice>
      )}
      {file && !isImportable && (
        <ImportPreview>
          <Trans>
            Sorry, the file <strong>{{ fileName: file.name }}</strong> is
            missing valid collections or documents.
          </Trans>
        </ImportPreview>
      )}
      {file && importDetails && isImportable ? (
        <>
          <ImportPreview as="div">
            <Trans>
              <strong>{{ fileName: file.name }}</strong> looks good, the
              following collections and their documents will be imported:
            </Trans>
            <List>
              {importDetails
                .filter((detail) => detail.type === "collection")
                .map((detail) => (
                  <ImportPreviewItem key={detail.path}>
                    <CollectionIcon />
                    <CollectionName>{detail.name}</CollectionName>
                  </ImportPreviewItem>
                ))}
            </List>
          </ImportPreview>
          <Button
            type="submit"
            onClick={handleImport}
            disabled={isImporting}
            primary
          >
            {isImporting ? `${t("Importing")}…` : t("Confirm & Import")}
          </Button>
        </>
      ) : (
        <Button type="submit" onClick={handlePickFile} primary>
          {t("Choose File…")}
        </Button>
      )}

      <h1>{t("Export")}</h1>
      <HelpText>
        <Trans>
          A full export might take some time, consider exporting a single
          document or collection if possible. We’ll put together a zip of all
          your documents in Markdown format and email it to{" "}
          <strong>{{ userEmail: user.email }}</strong>.
        </Trans>
      </HelpText>
      <Button
        type="submit"
        onClick={handleExport}
        disabled={isLoading || isExporting}
        primary
      >
        {isExporting
          ? t("Export Requested")
          : isLoading
          ? `${t("Requesting Export")}…`
          : t("Export Data")}
      </Button>
    </CenteredContent>
  );
}

const List = styled.ul`
  padding: 0;
  margin: 8px 0 0;
`;

const ImportPreview = styled(Notice)`
  margin-bottom: 16px;
`;

const ImportPreviewItem = styled.li`
  display: flex;
  align-items: center;
  list-style: none;
`;

const CollectionName = styled.span`
  font-weight: 500;
  margin-left: 4px;
`;

export default observer(ImportExport);
