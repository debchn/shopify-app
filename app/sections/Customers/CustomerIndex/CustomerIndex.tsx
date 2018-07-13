import * as React from 'react';
import {graphql, QueryResult} from 'react-apollo';
import {
  Page,
  Card,
  ResourceList,
  Avatar,
  TextStyle,
  Stack,
} from '@shopify/polaris';
import compose from '@shopify/react-compose';
import {autobind} from '@shopify/javascript-utilities/decorators';
import {parseGid} from 'utilities/shopify-merchant-api';

import customerIndexQuery, {
  CustomerIndexQueryQueryData,
} from './graphql/CustomerIndexQuery.graphql';

export interface Props {}
type ComposedProps = Props & QueryResult<CustomerIndexQueryQueryData>;

class CustomerIndex extends React.PureComponent<ComposedProps> {
  render() {
    const {data} = this.props;

    if (!data || !data.customers) {
      return null;
    }

    const {
      customers: {edges: customersEdges},
    } = data;

    return (
      <Page title="Customers">
        <Card>
          <ResourceList
            resourceName={{singular: 'customer', plural: 'customers'}}
            items={customersEdges}
            renderItem={this.renderCustomerRow}
          />
        </Card>
      </Page>
    );
  }

  @autobind
  private renderCustomerRow(item: CustomerIndexQueryQueryData.CustomersEdges) {
    const {
      node: {id, displayName, lifetimeDuration},
    } = item;

    const media = <Avatar customer size="medium" name={displayName} />;
    const customerId = parseGid(id);

    return (
      <ResourceList.Item
        id={id}
        url={`/customers/${customerId}`}
        media={media}
        accessibilityLabel={`View details for ${displayName}`}
      >
        <Stack>
          <Stack.Item fill>
            <h3>
              <TextStyle variation="strong">{displayName}</TextStyle>
            </h3>
          </Stack.Item>
          <div>{lifetimeDuration}</div>
        </Stack>
      </ResourceList.Item>
    );
  }
}

export default compose<Props>(
  graphql(customerIndexQuery, {options: {fetchPolicy: 'network-only'}}),
)(CustomerIndex);
