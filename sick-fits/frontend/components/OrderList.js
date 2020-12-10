import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage'
import formatMoney from '../lib/formatMoney';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import styled from 'styled-components';
import OrderItemStyles from './styles/OrderItemStyles';

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            createdAt
            items {
                id
                title
                description
                price
                image
                quantity
            }
        }
    }
`;

const orderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

export default class OrderList extends React.Component {
    render() {
        return (
            <Query query={USER_ORDERS_QUERY}>
                {({ data, error, loading }) => {
                    if (error) return <Error error={error} />
                    if (loading) return <p>Loading...</p>
                    const orders = data.orders;
                    return (
                        <div>
                            <h2>You have {orders.length} orders</h2>
                            {orders.map(order => (
                                <OrderItemStyles key={order.id}>
                                    <Link
                                        href={{
                                            pathname: '/order',
                                            query: { id: order.id },
                                        }}
                                    >
                                        <a>
                                            <div className="order-meta">
                                                <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
                                                <p>{order.items.length} Products</p>
                                                <p>{formatDistance(order.createdAt, new Date())}</p>
                                                <p>{formatMoney(order.total)}</p>
                                            </div>
                                            <div className="images">
                                                {order.items.map(item => (
                                                    <img key={item.id} src={item.image} alt={item.title} />
                                                ))}
                                            </div>
                                        </a>
                                    </Link>
                                </OrderItemStyles>
                            ))}
                        </div>
                    );
                }}
            </Query>
        );
    }
}
