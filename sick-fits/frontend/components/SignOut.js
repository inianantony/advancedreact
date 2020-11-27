import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage'
import Router from 'next/router'
import styled from 'styled-components'
import { CURRENT_USER_QUERY } from './User'

const SIGNOUT_MUTATION = gql`
    mutation SIGNOUT_MUTATION{
        signout{
            message
        }
    }
`;

const SignOut = props => (
    <Mutation refetchQueries={[{ query: CURRENT_USER_QUERY }]} mutation={SIGNOUT_MUTATION}>
        {(signout, { loading, error }) => (
            <button onClick={signout}>Sign Out</button>
        )}
    </Mutation>

);

export default SignOut;