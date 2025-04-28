import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    image: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  meetings: defineTable({
    title: v.string(),
    description: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(),
    hostId: v.string(), 
    users: v.array(v.string()), 
    streamCallId: v.string(),
    hostName: v.string(),
  })
  .index("by_host", ["hostId"])
  .index('by_stream_call_id', ['streamCallId']),

  comments: defineTable({
    meetingId: v.id('meetings'),
    userId: v.id('users'),
    content: v.optional(v.string()),
    rating: v.optional(v.number()),
    createdAt: v.number(),
  }).index('by_meeting', ['meetingId']).index('by_user', ['userId'])
});

