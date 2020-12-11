import { mount } from 'enzyme';
import wait from 'waait';
import RequestReset, { REQUEST_RESET_MUTATION } from '../components/RequestReset';
import { MockedProvider } from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';

const mocks = [{
    request: { query: REQUEST_RESET_MUTATION, variables: { email: 'antony@gmail.com' } },
    result: {
        data: {
            requestReset: { message: "success", __typename: 'Message' }
        }
    }
}];

describe("<RequestReset/>", () => {
    it("renders and match snapshot", () => {
        const wrapper = mount(
            <MockedProvider>
                <RequestReset />
            </MockedProvider>
        );
        expect(toJSON(wrapper.find("form"))).toMatchSnapshot();
    });

    it("calls the mutation", async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <RequestReset />
            </MockedProvider>
        );
        wrapper.find('input').simulate('change', { target: { name: 'email', value: 'antony@gmail.com' } });
        wrapper.find("form").simulate('submit');
        await wait();
        wrapper.update();
        expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
    });
});