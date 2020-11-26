const Query = {
    async items(parent, args, ctx, info) {
        const itemList = await ctx.db.query.items();
        return itemList;
    }
};

module.exports = Query;
