// @flow
import * as React from 'react';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';

const Error404 = () => {
  return (
    <CenteredContent>
      <PageTitle title="Not Found" />
      <h1>Not Found</h1>
      <p>We were unable to find the page you’re looking for.</p>
      <p>
        Go to <a href="/">homepage</a>.
      </p>
    </CenteredContent>
  );
};

export default Error404;
