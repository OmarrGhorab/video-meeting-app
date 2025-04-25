import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    image: v.optional(v.string()),
    email: v.string(),
    role: v.union(v.literal("host"), v.literal("participant")),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),
});

// https://faithful-buffalo-63.clerk.accounts.dev