import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './items';

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(
            id: $id
        ){
            id
            title
            price
            description
        }
    }
`;

export default class DeleteItem extends Component {
    updateCache = (cache, payload) => {
        const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
        console.log(data);
        data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);

        cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
    }
    render() {
        return (
            <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id: this.props.id }} update={this.updateCache}>
                {(deletItem, { error }) => (
                    <button onClick={() => {
                        if (confirm('Are you sure to delete?'))
                            deletItem();
                    }}>{this.props.children}</button>
                )}
            </Mutation>
        );
    }

}