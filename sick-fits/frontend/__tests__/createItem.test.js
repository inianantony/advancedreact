import { mount } from 'enzyme';
import wait from 'waait';
import Router from 'next/router';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { MockedProvider } from 'react-apollo/test-utils';
import toJSON from 'enzyme-to-json';
Router.router = {
    push(){},
    prefetch(){}
}

describe("<RequestReset/>", () => {
    it("renders and match snapshot", async () => {
    });
});