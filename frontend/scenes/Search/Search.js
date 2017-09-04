// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import keydown from 'react-keydown';
import { observable, action, runInAction } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import invariant from 'invariant';
import { client } from 'utils/ApiClient';
import Document from 'models/Document';
import DocumentsStore from 'stores/DocumentsStore';

import { withRouter } from 'react-router';
import { searchUrl } from 'utils/routeHelpers';
import styled from 'styled-components';
import ArrowKeyNavigation from 'boundless-arrow-key-navigation';

import Flex from 'components/Flex';
import CenteredContent from 'components/CenteredContent';
import LoadingIndicator from 'components/LoadingIndicator';
import SearchField from './components/SearchField';

import DocumentPreview from 'components/DocumentPreview';
import PageTitle from 'components/PageTitle';

type Props = {
  history: Object,
  match: Object,
  documents: DocumentsStore,
  notFound: ?boolean,
};

const Container = styled(CenteredContent)`
  > div {
    position: relative;
    height: 100%;
  }
`;

const ResultsWrapper = styled(Flex)`
  position: absolute;
  transition: all 300ms cubic-bezier(0.65, 0.05, 0.36, 1);
  top: ${props => (props.pinToTop ? '0%' : '50%')};
  margin-top: ${props => (props.pinToTop ? '40px' : '-75px')};
  width: 100%;
`;

const ResultList = styled(Flex)`
  opacity: ${props => (props.visible ? '1' : '0')};
  transition: all 400ms cubic-bezier(0.65, 0.05, 0.36, 1);
`;

const StyledArrowKeyNavigation = styled(ArrowKeyNavigation)`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

@observer class Search extends React.Component {
  firstDocument: HTMLElement;
  props: Props;
  store: SearchStore;

  @observable resultIds: Array<string> = []; // Document IDs
  @observable searchTerm: ?string = null;
  @observable isFetching = false;

  componentDidMount() {
    this.updateSearchResults();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.query !== this.props.match.params.query) {
      this.updateSearchResults();
    }
  }

  @keydown('esc')
  goBack() {
    this.props.history.goBack();
  }

  handleKeyDown = ev => {
    // Escape
    if (ev.which === 27) {
      ev.preventDefault();
      this.goBack();
    }

    // Down
    if (ev.which === 40) {
      ev.preventDefault();
      if (this.firstDocument) {
        const element = ReactDOM.findDOMNode(this.firstDocument);
        // $FlowFixMe
        if (element && element.focus) element.focus();
      }
    }
  };

  updateSearchResults = _.debounce(() => {
    this.search(this.props.match.params.query);
  }, 250);

  @action search = async (query: string) => {
    this.searchTerm = query;
    this.isFetching = true;

    if (query) {
      try {
        const res = await client.get('/documents.search', { query });
        invariant(res && res.data, 'res or res.data missing');
        const { data } = res;
        runInAction('search document', () => {
          // Fill documents store
          data.forEach(documentData =>
            this.props.documents.add(new Document(documentData))
          );
          this.resultIds = data.map(documentData => documentData.id);
        });
      } catch (e) {
        console.error('Something went wrong');
      }
    } else {
      this.resultIds = [];
    }

    this.isFetching = false;
  };

  updateQuery = query => {
    this.props.history.replace(searchUrl(query));
  };

  setFirstDocumentRef = ref => {
    this.firstDocument = ref;
  };

  get title() {
    const query = this.searchTerm;
    const title = 'Search';
    if (query) return `${query} - ${title}`;
    return title;
  }

  render() {
    const { documents } = this.props;
    const query = this.props.match.params.query;
    const hasResults = this.resultIds.length > 0;

    return (
      <Container auto>
        <PageTitle title={this.title} />
        {this.isFetching && <LoadingIndicator />}
        {this.props.notFound &&
          <div>
            <h1>Not Found</h1>
            <p>We're unable to find the page you're accessing.</p>
            <hr />
          </div>}
        <ResultsWrapper pinToTop={hasResults} column auto>
          <SearchField
            searchTerm={this.searchTerm}
            onKeyDown={this.handleKeyDown}
            onChange={this.updateQuery}
            value={query || ''}
          />
          <ResultList visible={hasResults}>
            <StyledArrowKeyNavigation
              mode={ArrowKeyNavigation.mode.VERTICAL}
              defaultActiveChildIndex={0}
            >
              {this.resultIds.map((documentId, index) => {
                const document = documents.getById(documentId);
                if (document)
                  return (
                    <DocumentPreview
                      innerRef={ref =>
                        index === 0 && this.setFirstDocumentRef(ref)}
                      key={documentId}
                      document={document}
                      highlight={this.searchTerm}
                      showCollection
                    />
                  );
              })}
            </StyledArrowKeyNavigation>
          </ResultList>
        </ResultsWrapper>
      </Container>
    );
  }
}

export default withRouter(inject('documents')(Search));
