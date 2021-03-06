const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require('../mail')
const { hasPermission } = require("../utils");
const stripe = require('../stripe');


const Mutations = {
    async createItem(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!')
        }

        const item = await ctx.db.mutation.createItem({
            data: { user: { connect: { id: ctx.request.userId } }, ...args }
        }, info);

        return item;
    },
    updateItem(parent, args, ctx, info) {
        const updates = { ...args };
        delete updates.id;
        return ctx.db.mutation.updateItem({
            data: updates,
            where: { id: args.id }
        }, info);
    },
    async deleteItem(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('Not logged in');
        }

        const where = { id: args.id };
        const item = await ctx.db.query.item({ where }, `{
            id 
            title 
            user { 
                id 
            }
        }`);

        const ownsIt = item.user.id === ctx.request.userId;
        const userPermissions = ctx.request.user.permissions;
        const hasPermission = userPermissions.includes("ADMIN") || userPermissions.includes("ITEMDELETE");
        if (!ownsIt && !hasPermission) throw new Error("Un Authorized");



        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10);
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] }
            }
        }, info);
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
        return user;
    },
    async signin(parent, args, ctx, info) {
        const user = await ctx.db.query.user({ where: { email: args.email } });
        if (!user) {
            throw new Error("Invalid Email or Password!");
        }
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
            throw new Error("Invalid Email or Password!");
        }
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
        return user;
    },
    async signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { message: "bye" };
    },
    async requestReset(parent, args, ctx, info) {
        const user = await ctx.db.query.user({ where: { email: args.email } });
        if (!user) {
            throw new Error("Invalid Email!");
        }
        const randomBytesPromisified = promisify(randomBytes);
        const resetToken = (await randomBytesPromisified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;
        const res = await ctx.db.mutation.updateUser({ where: { email: args.email }, data: { resetToken, resetTokenExpiry } });
        console.log(res);
        const mailResp = await transport.sendMail({
            from: 'admin@sickfits.com',
            to: user.email,
            subject: "Password reset request!",
            html: makeANiceEmail(`Your password reset token is here : \n\n <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Reset Password</a>`)
        });
        return { message: "Done" };
    },
    async resetPassword(parent, args, ctx, info) {
        if (args.password !== args.confirmPassword) {
            throw new Error("Invalid Password!");
        }
        const [user] = await ctx.db.query.users({ where: { resetToken: args.resetToken, resetTokenExpiry_gte: Date.now() - 3600000 } });
        if (!user) {
            throw new Error("Invalid Token or expired!");
        }
        const password = await bcrypt.hash(args.password, 10);
        const updatedUser = await ctx.db.mutation.updateUser({ where: { email: user.email }, data: { password, resetToken: null, resetTokenExpiry: null } });
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
        return updatedUser;
    },
    async updatePermissions(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('Not logged in');
        }
        const user = await ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
        hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
        return ctx.db.mutation.updateUser({
            data: {
                permissions: {
                    set: args.permissions
                }
            },
            where: {
                id: args.userId
            }
        }, info);
    },
    async addToCart(parent, args, ctx, info) {
        const { userId } = ctx.request;
        if (!userId) {
            throw new Error('Not logged in');
        }
        const [addedItem] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.id }
            }
        });
        if (addedItem) {
            return await ctx.db.mutation.updateCartItem({
                where: { id: addedItem.id },
                data: { quantity: addedItem.quantity + 1 }
            });
        }
        return await ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: { id: userId }
                },
                item: {
                    connect: { id: args.id }
                }
            }
        }, info);
    },
    async removeFromCart(parent, args, ctx, info) {
        const { userId } = ctx.request;
        if (!userId) {
            throw new Error('Not logged in');
        }
        const [addedItem] = await ctx.db.query.cartItems({
            where: {
                id: args.id,
                user: { id: userId }
            }
        });
        if (!addedItem) {
            throw new Error("No Item found");
        }
        return ctx.db.mutation.deleteCartItem({ where: { id: addedItem.id } }, info);
    },
    async createOrder(parent, args, ctx, info) {
        const { userId } = ctx.request;
        if (!userId) {
            throw new Error('Not logged in');
        }
        const user = await ctx.db.query.user({ where: { id: userId } }, `
        {
            id
            name
            email
            cart {
                id
                quantity
                item {
                    id
                    title
                    price
                    description
                    image
                    largeImage
                }
            }
        }
        `);
        const amount = user.cart.reduce((total, cartItem) => {
            return total + cartItem.item.price * cartItem.quantity;
        }, 0);
        const charge = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: args.token
        });
        const orderItems = user.cart.map((cartItem) => {
            let orderItem = {
                quantity: cartItem.quantity,
                ...cartItem.item,
                user: { connect: { id: userId } }
            }
            delete orderItem.id;
            return orderItem;
        });
        const order = await ctx.db.mutation.createOrder({
            data: {
                total: charge.amount,
                charge: charge.id,
                items: { create: orderItems },
                user: { connect: { id: userId } }
            }
        });
        const cartItemIds = user.cart.map(cartItem => cartItem.id);
        await ctx.db.mutation.deleteManyCartItems({
            where: {
                id_in: cartItemIds
            }
        });
        return order;
    }
};

module.exports = Mutations;
