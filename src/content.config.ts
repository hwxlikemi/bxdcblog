import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.string(),
    excerpt: z.string().optional(),
    draft: z.boolean().optional(),
    pinned: z.boolean().optional(),
  }),
});

export const collections = { posts };
