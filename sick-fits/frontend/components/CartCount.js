import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import User from './User';
import CartItems from './CartItems'
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const AnimationStyles = styled.span`
    position: relative;
    .count{
        display: block;
        position: relative;
        transition: all 1s;
        backface-visibility: hidden;
    }
    .count-enter{
        transform: scale(4) rotateX(0.5turn);
    }
    .count-enter-active{
        transform: rotateX(0);
    }
    .count-exit{
        top:0;
        position: absolute;
        transform: rotateX(0)
    }
    .count-exit-active{
        transform: scale(4) rotateX(0.5turn);
    }
`;

const Dot = styled.div`
    background: ${props => props.theme.red};
    color: white;
    border-radius: 50%;
    padding: 0.5rem;
    line-height: 2rem;
    min-width: 3rem;
    margin-left: 1rem;
    font-weight: 100;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
`;

const CartCount = props => {
    const count = props.count;
    return (
        <AnimationStyles>
            <TransitionGroup>
                <CSSTransition unmountOnExit className="count" classNames="count" key={count} timeout={{ enter: 1000, exit: 1000 }}>
                    <Dot>{count}</Dot>
                </CSSTransition>
            </TransitionGroup>
        </AnimationStyles>
    )
}

export default CartCount;