import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem, fakeOrder } from '../lib/testUtils';

const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: { ...fakeUser(), cart: [fakeCartItem()], }, }, },
    },
    {
        request: { query: SINGLE_ORDER_QUERY, variables: { id: "ord123" } },
        result: { data: { order: { ...fakeOrder() }, }, },
    },
];

describe('<AddToCart/>', () => {
    it('renders and matches the snap shot', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <Order id="ord123" />
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        expect(toJSON(wrapper.find('OrderStyles'))).toMatchSnapshot();
    });
});