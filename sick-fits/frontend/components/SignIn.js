import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signin(
            email: $email
            password: $password
        ){
            id,
            email,
            name
        }
    }
`;

export default class SignIn extends Component {
    state = {
        email: '',
        password: '',
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    render() {
        return (
            <Mutation refetchQueries={[{ query: CURRENT_USER_QUERY }]} mutation={SIGNIN_MUTATION} variables={this.state}>
                {(signin, { loading, error }) => (
                    <Form method="POST" onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await signin();
                        this.setState({ email: '', password: '' });
                    }}>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign In</h2>
                            <label htmlFor="email">
                                Email
                            <input type="email" id="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange} />
                            </label>
                            <label htmlFor="password">
                                Password
                            <input type="password" id="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange} />
                            </label>
                            <button type="Submit">Sign In</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export { SIGNIN_MUTATION };