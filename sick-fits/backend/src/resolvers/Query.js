const {forwardTo} = require('prisma-binding');
const Query = {
    async items(parent, args, ctx, info) {
        const itemList = await ctx.db.query.items();
        return itemList;
    },
    item: forwardTo('db'),

};

module.exports = Query;
