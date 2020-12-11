import { mount } from 'enzyme';
import wait from 'waait';
import NProgress from 'nprogress';
import Router from 'next/router';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';
import TakeMyMoney, { CREATE_ORDER_MUTATION } from '../components/TakeMyMoney';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

const mocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: { ...fakeUser(), cart: [fakeCartItem()], }, }, },
    },
    {
        request: { query: CREATE_ORDER_MUTATION },
        result: { data: { addToCart: { ...fakeCartItem(), quantity: 1, }, }, },
    },
];

describe('<AddToCart/>', () => {
    it('renders and matches the snap shot', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney />
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        expect(toJSON(wrapper.find('ReactStripeCheckout'))).toMatchSnapshot();
    });

    it('creates an order ontoken', async () => {
        const createOrderMock = jest.fn().mockResolvedValue({
            data: { createOrder: { id: 'xyz123' } }
        });
        Router.router = { push: jest.fn() };
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney />
            </MockedProvider>
        );
        const component = wrapper.find('TakeMyMoney').instance();
        component.onToken({ id: "abc123" }, createOrderMock);
        expect(createOrderMock).toHaveBeenCalledWith({ "variables": { "token": "abc123" } });
    });

    it('turns on the progress bar', async () => {
        const createOrderMock = jest.fn().mockResolvedValue({
            data: { createOrder: { id: 'xyz123' } }
        });
        Router.router = { push: jest.fn() };
        NProgress.start = jest.fn();
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney />
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        
        const component = wrapper.find('TakeMyMoney').instance();
        component.onToken({ id: "abc123" }, createOrderMock);
        expect(NProgress.start).toHaveBeenCalled();
    });

    it('routes to the order page after completion', async () => {
        const createOrderMock = jest.fn().mockResolvedValue({
            data: { createOrder: { id: 'xyz123' } }
        });
        Router.router = { push: jest.fn() };
        NProgress.start = jest.fn();
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <TakeMyMoney />
            </MockedProvider>
        );
        await wait();
        wrapper.update();

        const component = wrapper.find('TakeMyMoney').instance();
        component.onToken({ id: "abc123" }, createOrderMock);
        await wait();

        expect(Router.router.push).toHaveBeenCalledWith({"pathname": "/order", "query": {"id": "xyz123"}});
    });
});