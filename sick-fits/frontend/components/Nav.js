import Link from 'next/link';
import NavStyles from './styles/NavStyles'
import User from './User'
import SignOut from './SignOut'
import { Mutation } from 'react-apollo';
import { TOGGLE_CART_MUTATION } from '../components/Cart'
import CartCount from './CartCount';

const Nav = () => (
    <User>
        {
            ({ data: { me } }) => {
                return (
                    <NavStyles>
                        <Link href="/items">
                            <a>Shop</a>
                        </Link>
                        { me &&
                            (<>
                                <Link href="/sell">
                                    <a>Sell</a>
                                </Link>
                                <Link href="/orders">
                                    <a>Orders</a>
                                </Link>
                                <Link href="/me">
                                    <a>Account</a>
                                </Link>
                                <Mutation mutation={TOGGLE_CART_MUTATION}>{
                                    (toggleCart) => {
                                        return <button onClick={toggleCart}>
                                            My Cart
                                            <CartCount count={me.cart.reduce((total, item) => (total + item.quantity), 0)}></CartCount>
                                        </button>
                                    }}
                                </Mutation>
                                <SignOut />
                            </>)
                        }
                        {!me && (
                            <Link href="/signup">
                                <a>Sign In / Up</a>
                            </Link>
                        )
                        }
                    </NavStyles>
                )
            }
        }
    </User>
)

export default Nav;