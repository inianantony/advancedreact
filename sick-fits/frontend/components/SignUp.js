import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $password: String!, $name: String!) {
        signup(
            email: $email
            password: $password
            name: $name
        ){
            id,
            email,
            name
        }
    }
`;

export default class SignUp extends Component {
    state = {
        email: '',
        password: '',
        name: ''
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    render() {
        return (
            <Mutation refetchQueries={[{ query: CURRENT_USER_QUERY }]} mutation={SIGNUP_MUTATION} variables={this.state}>
                {(signup, { loading, error }) => (
                    <Form method="POST" onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await signup();
                        this.setState({ email: '', name: '', password: '' });
                    }}>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign Up for an Account</h2>
                            <label htmlFor="name">
                                Name
                            <input type="name" id="name" name="name" placeholder="Name" required value={this.state.name} onChange={this.handleChange} />
                            </label>
                            <label htmlFor="email">
                                Email
                            <input type="email" id="email" name="email" placeholder="Email" required value={this.state.email} onChange={this.handleChange} />
                            </label>
                            <label htmlFor="password">
                                Password
                            <input type="password" id="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange} />
                            </label>
                            <button type="Submit">Sign Up</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}