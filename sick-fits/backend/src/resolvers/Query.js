const { forwardTo } = require('prisma-binding');
const { hasPermission } = require("../utils");

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    async me(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            return null;
        }
        return await ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
    },
    async users(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('Not logged in');
        }
        hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
        return await ctx.db.query.users({}, info);
    },
    async permissions(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('Not logged in');
        }
        hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
        const query = `query{__type(name: "Permission") { enumValues{name}}}`;
        const variables = {};
        const permissionsList = await ctx.db.request(query, variables);
        const allPermission = permissionsList.data.__type.enumValues.map((per) => {
            return per.name;
        });
        return allPermission;
    },
    async order(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('Not logged in');
        }
        const order = await ctx.db.query.order({
            where: { id: args.id }
        }, info);
        const ownOrder = order.user.id === ctx.request.userId;
        const hasPrivilege = hasPermission(ctx.request.user, ["ADMIN"]);
        if(!hasPrivilege && !ownOrder){
            throw new Error('Order not found');
        }
        return order;
    },
};

module.exports = Query;
