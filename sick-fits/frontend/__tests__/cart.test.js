import { mount } from 'enzyme';
import wait from 'waait';
import Cart, { LOCAL_STATE_QUERY } from '../components/Cart';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
import { fakeCartItem, fakeUser } from '../lib/testUtils';

const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: { ...fakeUser(), cart: [fakeCartItem()] } } }
    },
    {
        request: { query: LOCAL_STATE_QUERY },
        result: { data: { cartOpen: true } }
    }
];

describe("<Cart/>", () => {
    it("renders and match snapshot", async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <Cart />
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        //console.log(wrapper.debug());
        expect(toJSON(wrapper.find("header"))).toMatchSnapshot();
        expect(wrapper.find("CartItems")).toHaveLength(1);
    });
});
