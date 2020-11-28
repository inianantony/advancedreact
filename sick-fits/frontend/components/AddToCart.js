import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const ADD_TO_CARD_MUTATION = gql`
    mutation ADD_TO_CARD_MUTATION($id:ID!){
        addToCart(id:$id){
            id
            quantity
        }
    }
`;

export default class AddToCart extends Component {
    render() {
        const { id } = this.props;
        return (
            <Mutation mutation={ADD_TO_CARD_MUTATION} variables={{ id }}>
                {(addToCart, { data, loading, error }) => {
                    return (
                        <button onClick={addToCart}>Add to Cart 🛒</button>
                    );
                }}
            </Mutation>

        );
    }
}