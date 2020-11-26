import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag'

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY{
        items {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;


export default class Items extends Component {
    render() {
        return <div>
            <p>Items Page</p>
            <Query query={ALL_ITEMS_QUERY}>
                {payload=>{
                    console.log(payload);
                    return <p>Hey I am from child query</p>
                }}
            </Query>
        </div>
    }
}