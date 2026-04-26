import { pgTable, text, varchar, timestamp, serial, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleEnum = pgEnum("user_role", ["member", "organizer", "admin"]);
export const oauthProviderEnum = pgEnum("oauth_provider", ["email", "google", "github"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  fullName: text("full_name"),
  role: userRoleEnum("role").notNull().default("member"),
  oauthProvider: oauthProviderEnum("oauth_provider").notNull().default("email"),
  googleId: varchar("google_id", { length: 255 }).unique(),
  githubId: varchar("github_id", { length: 255 }).unique(),
  avatar: text("avatar"),
  qrCode: text("qr_code"),
  userId: varchar("user_id", { length: 64 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
