import React from 'react';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import RemoveFromCart from './RemoveFromCart';

const CartItemStyled = styled.li`
    padding: 1rem 0;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    img{
        margin-right: 10px;
    }
    h3, p{
        margin: 0;
    }
`;

const CartItems = props => {
    const cartItem = props.cartItem;
    if (!cartItem.item) return <CartItemStyled><p>This item is removed</p><RemoveFromCart id={cartItem.id} /></CartItemStyled>
    return (
        <CartItemStyled>
            <img width="100px" src={cartItem.item.image} alt={cartItem.item.title} />
            <div className={cartItem.item.image}>
                <h3>{cartItem.item.title}</h3>
                <p>
                    {formatMoney(cartItem.item.price * cartItem.quantity)}
                    {' - '}
                    <em>{cartItem.quantity} &times; {formatMoney(cartItem.item.price)} each</em>
                </p>
            </div>
            <RemoveFromCart id={cartItem.id} />
        </CartItemStyled>
    );
}

CartItems.propTypes = {
    cartItem: PropTypes.object.isRequired
}

export default CartItems;