import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import SignIn from './SignIn';
import Error from './ErrorMessage'
import gql from 'graphql-tag';
import Table from './styles/Table'
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users{
            id
            name
            email
            permissions
        }
    }
`;

const PERMISSIONS_QUERY = gql`
    query PERMISSIONS_QUERY {
        permissions
    }
`;

const UPDATE_PERMISSION_MUTATION = gql`
    mutation UPDATE_PERMISSION_MUTATION($permissions:[Permission], $userId: ID!){
        updatePermissions(permissions:$permissions, userId: $userId){
            id
            permissions
            name
            email
        }
    }
`;

const Permissions = props => (
    <Query query={PERMISSIONS_QUERY}>
        {(payload) => {
            if (payload.loading) return <p>Loading...</p>
            return (<Query query={ALL_USERS_QUERY}>
                {({ error, loading, data }) => {
                    if (loading) return <p>Loading...</p>
                    if (!data.me) {
                        return (
                            <div>
                                <Error error={error} />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            {payload.data.permissions.map((per) => {
                                                return <th key={per}>{per}</th>
                                            })}
                                            <th>👇</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.users.map((usr) => {
                                            return <UserPermissionRow key={usr.id} user={usr} permissions={payload.data.permissions} />
                                        })}

                                    </tbody>
                                </Table>
                            </div>
                        );
                    }
                    return props.children;
                }}
            </Query>)
        }}
    </Query>
);

class UserPermissionRow extends React.Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array
        }).isRequired
    }
    state = {
        permissions: this.props.user.permissions
    }
    handleChange = (e) => {
        const { value, checked } = e.target;
        let updatedPermission = [...this.state.permissions];
        if (checked)
            updatedPermission.push(value);
        else
            updatedPermission = updatedPermission.filter((per) => {
                return per !== value;
            })
        this.setState({ permissions: updatedPermission });
    }
    render() {
        const { user, permissions } = this.props;
        return (
            <Mutation mutation={UPDATE_PERMISSION_MUTATION} variables={{permissions: this.state.permissions, userId: this.props.user.id}}>
                {(updatePermissions, { loading, error }) => (
                    <>
                    <Error error={error} />
                    <tr>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        {permissions.map((per) => {
                            return (
                                <td key={`${user.id}-${per}`}>
                                    <label htmlFor={`${user.id}-${per}`}>
                                        <input id={`${user.id}-${per}`} name={per} checked={this.state.permissions.includes(per)}
                                            value={per}
                                            onChange={this.handleChange}
                                            type="checkbox" />
                                    </label>
                                </td>
                            );
                        })}
                        <td><SickButton type="button" disabled={loading} onClick={updatePermissions}>Updat{loading? "ing" : "e"}</SickButton></td>
                    </tr>
                    </>
                )}
            </Mutation>
        );
    }
}

export default Permissions;