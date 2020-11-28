import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Form from './styles/Form';
import Error from './ErrorMessage'
import Router from 'next/router'
import styled from 'styled-components'

const CURRENT_USER_QUERY = gql`
    query {
        me{
            id,
            email,
            name,
            permissions
        }
    }
`;

const User = props => (
    <Query {...props} query={CURRENT_USER_QUERY}>
        {payload => props.children(payload)}
    </Query>
);

User.propTypes = {
    children: PropTypes.func.isRequired
}

export default User;
export { CURRENT_USER_QUERY };

