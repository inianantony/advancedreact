import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

function totalItems(cart){
    return cart.reduce((total, item)=>{
        return total + item.quantity;
    },0);
}

export default class TakeMyMoney extends React.Component {
    onToken = (resp)=>{

    }
    render() {
        return (
            <User>
                {({ data: { me } }) => {
                    return (
                        <StripeCheckout
                            amount={calcTotalPrice(me.cart)}
                            name="Sick Fits"
                            description={`Order of ${totalItems(me.cart)} items`}
                            image={me.cart && me.cart[0] && me.cart[0].item.image}
                            stripeKey="pk_test_51Ht01sBJ0GjI8Ju9S3GMjmWjB2ulmqCLZEIGwaknTWHvC1zQ7HaZXg7Fp6sh4KbuvQqzhkRPPhwKs5ecxW1gC7SB00WoDuz5ZB"
                            currency="USD"
                            email={me.email}
                            token={resp=> this.onToken(resp)}
                        >{this.props.children}</StripeCheckout>
                    );
                }}
            </User>
        );
    }
}