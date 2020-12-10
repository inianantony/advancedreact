import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import User from './User';
import CartItems from './CartItems'
import Error from './ErrorMessage'
import OrderStyles from './styles/OrderStyles'
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import { adopt } from 'react-adopt';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Head from 'next/head';

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!){
        order(id: $id){
            id
            charge
            total
            createdAt
            user{
                id
            }
            items{
                id,
                title
                description
                price
                image
                quantity
            }
        }
    }
`;

export default class Order extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }
    render() {
        return (
            <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
                {({ data, error, loading }) => {
                    if (error) return <Error error={error} />
                    if (loading) return <p>Loading...</p>
                    const order = data.order;
                    return <OrderStyles>
                        <Head>Sick Fits - Order {order.id}</Head>
                        <p><span> Order Id : </span><span>{this.props.id}</span></p>
                        <p><span> Charge : </span><span>{order.charge}</span></p>
                        <p><span> Date : </span><span>{format(order.createdAt, "MMMM d, YYYY h:mm a")}</span></p>
                        <p><span> Order Total : </span><span>{formatMoney(order.total)}</span></p>
                        <p><span> Item Count : </span><span>{order.items.length}</span></p>
                        <div className="items">
                            {order.items.map(item => (
                                <div className="order-item" key={item.id}>
                                    <img src={item.image} alt={item.title} />
                                    <div className="item-details">
                                        <h2>{item.title}</h2>
                                        <p>Qty: {item.quantity}</p>
                                        <p>Each: {formatMoney(item.price)}</p>
                                        <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </OrderStyles>
                }}
            </Query>
        );
    }
}
