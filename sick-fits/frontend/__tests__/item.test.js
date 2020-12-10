import ItemComponent from '../components/item';
import {shallow} from 'enzyme';

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

        expect(priceTag.children().text()).toBe("$50");
        expect(title.text()).toBe("a cool title");
        expect(img.props().src).toBe(fakeItem.image);
        expect(img.props().alt).toBe(fakeItem.title);
    });

    it("renders the button properly",()=>{
        const wrapper = shallow(<ItemComponent item={fakeItem}/>);
        const buttonList = wrapper.find(".buttonList");
        console.log(buttonList.debug());
        expect(buttonList.children().length).toBe(3);
        expect(buttonList.find("Link")).toHaveLength(1);
        expect(buttonList.find("AddToCart").exists()).toBeTruthy;
        expect(buttonList.find("DeleteItem").exists()).toBe(true);
    })
});