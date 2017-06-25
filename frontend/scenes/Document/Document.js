// @flow
import React, { Component } from 'react';
import get from 'lodash/get';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { withRouter, Prompt } from 'react-router';
import { Flex } from 'reflexbox';

import UiStore from 'stores/UiStore';

import DocumentStore from './DocumentStore';
import Menu from './components/Menu';
import Editor from 'components/Editor';
import { HeaderAction, SaveAction } from 'components/Layout';
import PublishingInfo from 'components/PublishingInfo';
import PreviewLoading from 'components/PreviewLoading';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';

const DISCARD_CHANGES = `
You have unsaved changes.
Are you sure you want to discard them?
`;

type Props = {
  match: Object,
  history: Object,
  keydown: Object,
  newChildDocument?: boolean,
  ui: UiStore,
};

@observer class Document extends Component {
  store: DocumentStore;
  props: Props;

  constructor(props: Props) {
    super(props);
    this.store = new DocumentStore({
      history: this.props.history,
      ui: props.ui,
    });
  }

  componentDidMount() {
    if (this.props.newDocument) {
      this.store.collectionId = this.props.match.params.id;
      this.store.newDocument = true;
    } else if (this.props.match.params.edit) {
      this.store.documentId = this.props.match.params.id;
      this.store.fetchDocument();
    } else if (this.props.newChildDocument) {
      this.store.documentId = this.props.match.params.id;
      this.store.newChildDocument = true;
      this.store.fetchDocument();
    } else {
      this.store.documentId = this.props.match.params.id;
      this.store.newDocument = false;
      this.store.fetchDocument();
    }
  }

  componentWillUnmout() {
    this.props.ui.clearActiveCollection();
  }

  onEdit = () => {
    const url = `${this.store.document.url}/edit`;
    this.props.history.push(url);
    this.props.ui.enableEditMode();
  };

  onSave = async (options: { redirect?: boolean } = {}) => {
    if (this.store.newDocument || this.store.newChildDocument) {
      await this.store.saveDocument(options);
    } else {
      await this.store.updateDocument(options);
    }
    this.props.ui.disableEditMode();
  };

  onImageUploadStart = () => {
    this.store.updateUploading(true);
  };

  onImageUploadStop = () => {
    this.store.updateUploading(false);
  };

  onCancel = () => {
    this.props.history.goBack();
  };

  render() {
    const isNew = this.props.newDocument || this.props.newChildDocument;
    const isEditing = this.props.match.params.edit;
    /*const title = (
      <Breadcrumbs
        document={this.store.document}
        pathToDocument={this.store.pathToDocument}
      />
    );*/

    const titleText = this.store.document && get(this.store, 'document.title');

    const actions = (
      <Flex>
        <HeaderAction>
          {isEditing
            ? <SaveAction
                onClick={this.onSave}
                disabled={this.store.isSaving}
                isNew={!!isNew}
              />
            : <a onClick={this.onEdit}>Edit</a>}
        </HeaderAction>
        {!isEditing &&
          <Menu store={this.store} document={this.store.document} />}
      </Flex>
    );

    return (
      <Container>
        <Actions>{actions}</Actions>
        <PagePadding auto justify="center">
          <PageTitle title={titleText} />
          <Prompt
            when={this.store.hasPendingChanges}
            message={DISCARD_CHANGES}
          />
          {this.store.isFetching &&
            <CenteredContent>
              <PreviewLoading />
            </CenteredContent>}
          {this.store.document &&
            <DocumentContainer>
              {!isEditing &&
                <PublishingInfo
                  collaborators={this.store.document.collaborators}
                  createdAt={this.store.document.createdAt}
                  createdBy={this.store.document.createdBy}
                  updatedAt={this.store.document.updatedAt}
                  updatedBy={this.store.document.updatedBy}
                />}
              <Editor
                text={this.store.document.text}
                onImageUploadStart={this.onImageUploadStart}
                onImageUploadStop={this.onImageUploadStop}
                onChange={this.store.updateText}
                onSave={this.onSave}
                onCancel={this.onCancel}
                readOnly={!isEditing}
              />
            </DocumentContainer>}
        </PagePadding>
      </Container>
    );
  }
}

const Container = styled(Flex)`
  position: relative;
  width: 100%;
`;

const PagePadding = styled(Flex)`
  padding: 80px 20px;
`;

const Actions = styled(Flex)`
  position: absolute;
  top: 0;
  right: 20px;
`;

const DocumentContainer = styled.div`
  font-weight: 400;
  font-size: 1em;
  line-height: 1.5em;
  padding: 0 3em;
  width: 50em;
`;

export default withRouter(inject('ui')(Document));
