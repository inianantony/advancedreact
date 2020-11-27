import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage'
import styled from 'styled-components'
import Head from 'next/head'

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id:ID!) {
        item(where :{id:$id}){
            id
            title
            price
            description
            largeImage
        }
    }
`;

const SingleItemStyle = styled.div`
    max-width: 1200px;
    margin: 2rem auto; 
    box-shadow: ${props => props.theme.bs};
    display:grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;
    img{
        width: 100%;
        height:100%;
        object-fit: contain;
    }
    .details{
        margin: 3rem;
        font-size: 2rem;
    }
`;

export default class SingleItem extends Component {
    render() {
        return (<Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
            {({ error, loading, data }) => {
                if (error) return <Error error={error} />
                if (loading) return <p>Loading...</p>
                if (!data.item) return <p>No Item found for {this.props.id}...</p>
                const item = data.item;
                return (
                    <SingleItemStyle>
                        <Head>
                            <title>Sick Fits | {item.title}</title>
                        </Head>
                        <img src={item.largeImage} alt={item.title} />
                        <h2>Viewing {item.title}</h2>
                    </SingleItemStyle>
                )
            }}
        </Query>

        );
    }
}