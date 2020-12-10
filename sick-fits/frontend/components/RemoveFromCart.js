import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const REMOVE_FROM_CART_MUTATION = gql`
    mutation REMOVE_ITEM_FROM_CART_MUTATION($id: ID!) {
        removeFromCart(id: $id){
            id
        }
    }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover{
        color: ${props => props.theme.red};
        cursor: pointer;
    }
`;

export default class RemoveFromCart extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }
    updateCache = (cache, payload) => {
        const data = cache.readQuery({ query: CURRENT_USER_QUERY });
        const removedId = payload.data.removeFromCart.id;
        data.me.cart = data.me.cart.filter(item => item.id !== removedId);

        cache.writeQuery({ query: CURRENT_USER_QUERY, data });
    }
    render() {
        return (
            <Mutation mutation={REMOVE_FROM_CART_MUTATION}
                variables={{ id: this.props.id }} update={this.updateCache}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: {
                        __typename: 'CartItem',
                        id: this.props.id
                    }
                }}>
                {(removeFromCart, { loading, error }) => {
                    return (
                        <BigButton disabled={loading} title="Delete Item" onClick={() => {
                            if (confirm('Are you sure to remove?'))
                                removeFromCart().catch(err => alert(err));
                        }}>&times;</BigButton>
                    );
                }}
            </Mutation>
        );
    }
}