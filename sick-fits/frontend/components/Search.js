import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import { Query, Mutation,ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import User from './User';
import CartItems from './CartItems'
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import { adopt } from 'react-adopt';
import Downshift from 'downshift';
import Router from 'next/router';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!){
        items(where:{
            OR:[{title_contains: $searchTerm}, {description_contains: $searchTerm}]    
        }){
            id
            title
            image
        }
    }
`;

export default class AutoComplete extends React.Component {
    state={
        items: [],
        loading: true
    }
    onChange = debounce(async (e, client) => {
        this.setState({loading: true});
        const resp = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: {searchTerm: e.target.value}
        })
        this.setState({
            items: resp.data.items,
            loading: false
        })
    }, 350);
    render(){
        return (
            <SearchStyles>
                <div>
                    <ApolloConsumer>
                        {(client)=>{
                            return (
                                <input type="search" onChange={(e)=>{
                                    e.persist();
                                    this.onChange(e,client);
                                }} />
                            );
                        }}
                    </ApolloConsumer>
                    
                    <DropDown>
                        {this.state.items.map((item)=>{
                            return (
                                <DropDownItem key={item.id}>
                                    <img width="50" src={item.image} alt={item.title}/>
                                    {item.title}
                                </DropDownItem>   
                            );
                        })}
                    </DropDown>
                </div>
            </SearchStyles>
        );
    }
}