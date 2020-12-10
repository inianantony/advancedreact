import ItemComponent from '../components/item';
import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
    id: "AABB",
    title: 'a cool title',
    price: 5000,
    description: "an amazing item",
    image: "small_img.jpg",
    largeImage: "large_img.jpg"
}

describe("<Item/>",()=>{
    it("renders and displays properly", ()=>{
        const wrapper = shallow(<ItemComponent item={fakeItem}/>);
        const priceTag = wrapper.find('PriceTag');
        const title = wrapper.find('Title a');
        const img = wrapper.find('img');

        expect(toJSON(wrapper)).toMatchSnapshot();
       
    });
});