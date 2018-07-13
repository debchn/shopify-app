import * as React from 'react';
import {withRouter, RouteComponentProps} from 'react-router';
import {graphql} from 'react-apollo';
import {Page, FormLayout, TextField} from '@shopify/polaris';
import compose from '@shopify/react-compose';
import {autobind} from '@shopify/javascript-utilities/decorators';

import {composeGid} from 'utilities/shopify-merchant-api';
import {GraphQLQuery, GraphQLMutation} from 'utilities/graphql';

import customerShowQuery, {
  CustomerShowQueryQueryData,
} from './graphql/CustomerShowQuery.graphql';

import customerUpdateMutation, {
  CustomerUpdateMutationData,
} from './graphql/CustomerUpdateMutation.graphql';

interface Params {
  customerId: string;
}

export interface Props {}
type ComposedProps = Props &
  RouteComponentProps<Params> &
  GraphQLQuery<
    CustomerShowQueryQueryData,
    CustomerShowQueryQueryData.Variables
  > &
  GraphQLMutation<
    CustomerUpdateMutationData,
    CustomerUpdateMutationData.Variables,
    'customerUpdateMutation'
  >;

interface State {
  firstName?: string;
  lastName?: string;
  loading: boolean;
}

class CustomerShow extends React.PureComponent<ComposedProps, State> {
  state: State = {
    firstName: undefined,
    lastName: undefined,
    loading: false,
  };

  render() {
    const {data} = this.props;

    if (!data || !data.customer) {
      return null;
    }

    const {
      firstName: initialFirstName,
      lastName: initialLastName,
    } = data.customer;

    const {firstName, lastName} = this.state;

    return (
      <Page
        singleColumn
        title="Customer"
        breadcrumbs={[{content: 'Customers', url: '/customers'}]}
        primaryAction={{
          content: 'Save',
          onAction: this.handleCustomerUpdate,
          loading: this.state.loading,
        }}
      >
        <FormLayout>
          <TextField
            id="firstName"
            label="First Name"
            value={firstName || initialFirstName || ''}
            onChange={this.handleFirstNameChange}
          />
          <TextField
            id="lastName"
            label="Last Name"
            value={lastName || initialLastName || ''}
            onChange={this.handleLastNameChange}
          />
        </FormLayout>
      </Page>
    );
  }

  @autobind
  private handleFirstNameChange(firstName: string) {
    this.setState({firstName});
  }

  @autobind
  private handleLastNameChange(lastName: string) {
    this.setState({lastName});
  }

  @autobind
  private async handleCustomerUpdate() {
    const {
      customerUpdateMutation,
      match: {
        params: {customerId},
      },
    } = this.props;

    this.setState({loading: true});

    await customerUpdateMutation({
      variables: {
        input: {
          id: composeGid('Customer', customerId),
          firstName: this.state.firstName,
          lastName: this.state.lastName,
        },
      },
    });

    this.setState({loading: false});
  }
}

export default compose<Props>(
  withRouter as any,
  graphql(customerShowQuery, {
    options: ({
      match: {
        params: {customerId},
      },
    }: ComposedProps) => ({
      variables: {
        customerId: composeGid('Customer', customerId),
      },
    }),
  }),
  graphql(customerUpdateMutation, {name: 'customerUpdateMutation'}),
)(CustomerShow);
