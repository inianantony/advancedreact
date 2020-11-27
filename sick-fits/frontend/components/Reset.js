import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage'
import Router from 'next/router'
import styled from 'styled-components'
import { CURRENT_USER_QUERY } from './User'
import PropTypes from 'prop-types';

const RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(
            resetToken: $resetToken
            password: $password
            confirmPassword: $confirmPassword
        ){
            id
            email
            name
        }
    }
`;

export default class Reset extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired
    }
    state = {
        password: '',
        confirmPassword: ''
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    render() {
        return (
            <Mutation refetchQueries={[{query:CURRENT_USER_QUERY}]} mutation={RESET_MUTATION} variables={{ resetToken: this.props.resetToken, password: this.state.password, confirmPassword: this.state.confirmPassword }}>
                {(resetPassword, { loading, error, called }) => (
                    <Form method="POST" onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await resetPassword();
                        this.setState({ password: '', confirmPassword: '' });
                    }}>
                        <Error error={error} />
                        {!error && !loading && called && <p>Success to reset your password! Enjoy Shopping!</p>}
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Reset your Password</h2>
                            <label htmlFor="password">
                                Password
                            <input type="password" id="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange} />
                            </label>
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required value={this.state.confirmPassword} onChange={this.handleChange} />
                            </label>
                            <button type="Submit">Reset Password</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}