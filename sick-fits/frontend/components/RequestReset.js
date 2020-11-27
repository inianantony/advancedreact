import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage'
import Router from 'next/router'
import styled from 'styled-components'
import { CURRENT_USER_QUERY } from './User'

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        requestReset(
            email: $email
        ){
            message
        }
    }
`;

export default class RequestReset extends Component {
    state = {
        email: '',
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    render() {
        return (
            <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
                {(requestReset, { loading, error, called }) => (
                    <Form method="POST" onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await requestReset();
                        this.setState({ email: '' });
                    }}>
                        <Error error={error} />
                        {!error && !loading && called && <p>Success! Check your email for reset link</p>}
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign In</h2>
                            <label htmlFor="email">
                                Email
                            <input type="email" id="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange} />
                            </label>
                            <button type="Submit">Reset Password</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}