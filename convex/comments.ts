import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addComment = mutation({
    args: {
        content: v.string(),
        rating: v.number(),
        meetingId: v.id('meetings')
    }, 
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('user is not authenticated');
      
        // Lookup the user by Clerk ID
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
          .first();
      
        if (!user) throw new Error("User not found");
      
        return await ctx.db.insert("comments", {
          meetingId: args.meetingId,
          content: args.content,
          rating: args.rating,
          createdAt: Date.now(),
          userId: user._id, // this is Convex ID
        });
      }
});

// get meeting comments 
export const getComments = query({
    args: {
        meetingId: v.id('meetings'),
    },

    handler: async (ctx, args) => {
        const comments = await ctx.db.query('comments').withIndex('by_meeting', q => q.eq('meetingId', args.meetingId)).collect();

        return comments;
    }
})