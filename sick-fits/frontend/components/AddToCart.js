import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User'

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
            <Mutation refetchQueries={[{ query: CURRENT_USER_QUERY }]} mutation={ADD_TO_CARD_MUTATION} variables={{ id }}>
                {(addToCart, { data, loading, error }) => {
                    return (
                        <button disabled={loading} onClick={addToCart}>Add{loading ? "ing" : ""} to Cart 🛒</button>
                    );
                }}
            </Mutation>
        );
    }
}