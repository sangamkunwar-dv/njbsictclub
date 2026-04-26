import { pgTable, text, timestamp, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type SocialLinks = {
  twitter?: string;
  linkedin?: string;
  github?: string;
};

export const teamTable = pgTable("team", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  email: text("email"),
  phone: text("phone"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  socialLinks: jsonb("social_links").$type<SocialLinks>(),
  skills: jsonb("skills").$type<string[]>(),
  joinDate: timestamp("join_date", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teamTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamSchema>;
export type TeamMember = typeof teamTable.$inferSelect;
