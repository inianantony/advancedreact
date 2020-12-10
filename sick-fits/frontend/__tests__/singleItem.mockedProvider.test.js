import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeItem } from '../lib/testUtils';

const mocks = [{
    request: { query: SINGLE_ITEM_QUERY, variables: { id: 123 } },
    result: {
        data: {
            item: fakeItem()
        }
    }
}];

describe("<SingleItem />", () => {
    it("renders", () => {
        const wrapper = mount(<MockedProvider mocks={mocks}><SingleItem id={123} /></MockedProvider>);
    });

    it("displays proper data", async () => {
        const wrapper = mount(<MockedProvider mocks={mocks}><SingleItem id={123} /></MockedProvider>);
        expect(wrapper.text()).toBe("Loading...");

        await wait();
        wrapper.update();

        expect(toJSON(wrapper.find("h2"))).toMatchSnapshot();
        expect(toJSON(wrapper.find("img"))).toMatchSnapshot();
        expect(toJSON(wrapper.find("p"))).toMatchSnapshot();
    });

    it('Errors with a not found item', async () => {
        const mocks = [
            {
                request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
                result: {
                    errors: [{ message: 'Items Not Found!' }],
                },
            },
        ];
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id="123" />
            </MockedProvider>
        );
        await wait();
        wrapper.update();
        const item = wrapper.find('[data-test="graphql-error"]');
        expect(item.text()).toContain('Items Not Found!');
        expect(toJSON(item)).toMatchSnapshot();
    });
});