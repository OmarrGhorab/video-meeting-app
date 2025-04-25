import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserMeetings = query({
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return [];
  
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();
  
      if (!user) throw new Error("User not found");
  
      // Get all meetings (or optimize later)
      const meetings = await ctx.db.query("meetings").collect();
  
      // Filter: show meetings where user is involved
      const userMeetings = meetings.filter((meeting) =>
        meeting.users.includes(user._id)
      );
  
      return userMeetings;
    }
});
  
export const getMeetingByStreamCallId = query({
    args: {
        streamCallId: v.string(),
    },

    handler: async (ctx, args) => {
        await ctx.db.query('meetings').withIndex('by_stream_call_id', q => q.eq('streamCallId', args.streamCallId)).first();
    },
})

export const createMeeting = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        startTime: v.number(),
        endTime: v.optional(v.number()),
        status: v.string(),
        hostId: v.id("users"),
        users: v.array(v.id("users")),
        streamCallId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('user is not authenticated');

        return await ctx.db.insert('meetings', {
            ...args,
        })
    },
})

export const updateMeetingStatus = mutation({
    args: {
        id: v.id('meetings'),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, {
            status: args.status,
            ...(args.status === "completed" ? { endTime: Date.now() } : {}),
        })
    },
})