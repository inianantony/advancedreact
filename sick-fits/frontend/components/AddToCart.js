import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

class AddToCart extends React.Component {
    updateCache = (cache, payload) => {
        const data = cache.readQuery({ query: CURRENT_USER_QUERY });
        data.me.cart.push(payload.data.addToCart);
        cache.writeQuery({ query: CURRENT_USER_QUERY, data });
    }
    render() {
        const { id } = this.props;
        return (
            <Mutation
                mutation={ADD_TO_CART_MUTATION}
                update={this.updateCache}
                variables={{
                    id,
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(addToCart, { loading }) => (
                    <button disabled={loading} onClick={addToCart}>
                        Add{loading && 'ing'} To Cart 🛒
                    </button>
                )}
            </Mutation>
        );
    }
}
export default AddToCart;
export { ADD_TO_CART_MUTATION };