const {forwardTo} = require('prisma-binding');
const Query = {
    // async items(parent, args, ctx, info) {
    //     const itemList = await ctx.db.query.items();
    //     return itemList;
    // },
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    async me(parent,args, ctx,info){
        if(!ctx.request.userId){
            return null;
        }
        return await ctx.db.query.user({where: {id:ctx.request.userId}},info);
    }
};

module.exports = Query;
