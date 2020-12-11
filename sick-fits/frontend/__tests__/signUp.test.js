import { mount } from 'enzyme';
import wait from 'waait';
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import { fakeUser } from '../lib/testUtils';
import { ApolloConsumer } from 'react-apollo';

const me = fakeUser();
const mocks = [
    {
        request: { query: SIGNUP_MUTATION, variables: { email: me.email, name: me.name, password: "pass123", } },
        result: { data: { signup: { id: 'abc123', email: me.email, name: me.name, __typename: 'User' } } }
    },
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me } }
    },
];

function type(wrapper, name, value) {
    wrapper.find(`input[type="${name}"]`).simulate('change', { target: { name, value } })
}

describe("<SignUp/>", () => {
    it("renders and match snapshot", () => {
        const wrapper = mount(
            <MockedProvider>
                <SignUp />
            </MockedProvider>
        );
        expect(toJSON(wrapper.find("form"))).toMatchSnapshot();
    });

    it("calls the mutation properly", async () => {
        let apolloClient;
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloConsumer>
                    {client => {
                        apolloClient = client;
                        return <SignUp />
                    }}
                </ApolloConsumer>
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        type(wrapper, 'name', me.name);
        type(wrapper, 'email', me.email);
        type(wrapper, 'password', "pass123");
        wrapper.update();
        wrapper.find("form").simulate('submit');
        await wait();
        const user = await apolloClient.query({query: CURRENT_USER_QUERY});
        expect(user.data.me).toMatchObject(me);
    });
});