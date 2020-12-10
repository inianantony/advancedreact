import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
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