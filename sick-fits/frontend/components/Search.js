import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
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

function routeToItem(item) {
    Router.push({
        pathname: '/item',
        query: {
            id: item.id,
        },
    });
}

export default class AutoComplete extends React.Component {
    state = {
        items: [],
        loading: false
    }
    onChange = debounce(async (e, client) => {
        this.setState({ loading: true });
        const resp = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: { searchTerm: e.target.value }
        })
        this.setState({
            items: resp.data.items,
            loading: false
        })
    }, 350);
    render() {
        resetIdCounter();
        return (
            <SearchStyles>
                <Downshift onChange={routeToItem} itemToString={item => (item === null ? '' : item.title)}>
                    {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
                        <div>
                            <ApolloConsumer>
                                {client => (
                                    <input
                                        {...getInputProps({
                                            type: 'search',
                                            placeholder: 'Search For An Item',
                                            id: 'search',
                                            className: this.state.loading ? 'loading' : '',
                                            onChange: e => {
                                                e.persist();
                                                this.onChange(e, client);
                                            },
                                        })}
                                    />
                                )}
                            </ApolloConsumer>
                            {isOpen && (<DropDown>
                                {this.state.items.map((item, index) => {
                                    return (
                                        <DropDownItem
                                            {...getItemProps({
                                                item
                                            })}
                                            highlighted={index == highlightedIndex}
                                            key={item.id}>
                                            <img width="50" src={item.image} alt={item.title} />
                                            {item.title}
                                        </DropDownItem>
                                    );
                                })}
                            </DropDown>
                            )}
                        </div>
                    )}
                </Downshift>
            </SearchStyles>
        );
    }
}