import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import SignIn from './SignIn';
import Error from './ErrorMessage'
import gql from 'graphql-tag';
import Table from './styles/Table'
import SickButton from './styles/SickButton';

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

const Permissions = props => (
    <Query query={PERMISSIONS_QUERY}>
        {(payload) => {
            if (payload.loading) return <p>Loading...</p>
            return (<Query query={ALL_USERS_QUERY}>
                {({ error, loading, data }) => {
                    if (loading) return <p>Loading...</p>
                    console.log(payload.data.permissions);
                    console.log(data.users);
                    if (!data.me) {
                        return (
                            <div>
                                <Error error={error} />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            {payload.data.permissions.map((per)=>{
                                                return <th key={per}>{per}</th>
                                            })}
                                            <th>👇</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.users.map((usr)=>{
                                            return (
                                                <tr>
                                                    <td>{usr.name}</td>
                                                    <td>{usr.email}</td>
                                                    {payload.data.permissions.map((per)=>{
                                                        if(usr.permissions.includes(per)){
                                                            return (
                                                                <td>
                                                                    <label htmlFor={per}>
                                                                        <input id={per} name={per} type="checkbox" checked/>
                                                                    </label>
                                                                 </td>
                                                            );
                                                        }
                                                        return (
                                                            <td>
                                                                <label htmlFor={per}>
                                                                    <input id={per} name={per} type="checkbox"/>
                                                                </label>
                                                             </td>
                                                        );
                                                    })}
                                                    <td><SickButton>Update</SickButton></td>
                                                </tr>
                                            );
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

export default Permissions;