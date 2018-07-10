import * as React from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';

import {AppProvider} from '@shopify/polaris';
import Link from '../Link';
import Routes from '../Routes';

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include',
  },
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AppProvider linkComponent={Link}>
        <Routes />
      </AppProvider>
    </ApolloProvider>
  );
}
