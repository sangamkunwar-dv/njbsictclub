import { Router, type IRouter } from "express";
import { count, desc, eq } from "drizzle-orm";
import {
  db,
  usersTable,
  eventsTable,
  projectsTable,
  teamTable,
  messagesTable,
  attendanceTable,
  settingsTable,
  insertEventSchema,
  insertProjectSchema,
  insertTeamSchema,
  insertSettingsSchema,
  insertUserSchema,
} from "@workspace/db";
import { requireAdmin, hashPassword, generateUserId } from "../lib/auth";

const router: IRouter = Router();

router.use("/admin", requireAdmin);

router.get("/admin/stats", async (_req, res) => {
  const [[users], [events], [projects], [messages]] = await Promise.all([
    db.select({ value: count() }).from(usersTable),
    db.select({ value: count() }).from(eventsTable),
    db.select({ value: count() }).from(projectsTable),
    db.select({ value: count() }).from(messagesTable),
  ]);
  res.json({
    totalMembers: users?.value ?? 0,
    totalEvents: events?.value ?? 0,
    totalProjects: projects?.value ?? 0,
    totalMessages: messages?.value ?? 0,
  });
});

router.get("/admin/users", async (_req, res) => {
  const users = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      fullName: usersTable.fullName,
      role: usersTable.role,
      oauthProvider: usersTable.oauthProvider,
      userId: usersTable.userId,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));
  res.json(users);
});

router.post("/admin/users", async (req, res) => {
  const { password, ...rest } = req.body ?? {};
  const parsed = insertUserSchema.safeParse({
    ...rest,
    userId: rest.userId ?? generateUserId(),
  });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid user", issues: parsed.error.issues });
    return;
  }
  const passwordHash =
    typeof password === "string" && password.length >= 6
      ? await hashPassword(password)
      : null;
  const [created] = await db
    .insert(usersTable)
    .values({ ...parsed.data, password: passwordHash })
    .returning();
  if (!created) {
    res.status(500).json({ error: "Failed to create user" });
    return;
  }
  const { password: _p, ...safe } = created;
  res.status(201).json(safe);
});

router.delete("/admin/users/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.json({ success: true });
});

router.get("/admin/events", async (_req, res) => {
  res.json(await db.select().from(eventsTable));
});
router.post("/admin/events", async (req, res) => {
  const parsed = insertEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [created] = await db.insert(eventsTable).values(parsed.data).returning();
  res.status(201).json(created);
});
router.put("/admin/events/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = insertEventSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [updated] = await db
    .update(eventsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(eventsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});
router.delete("/admin/events/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(eventsTable).where(eq(eventsTable.id, id));
  res.json({ success: true });
});

router.get("/admin/projects", async (_req, res) => {
  res.json(await db.select().from(projectsTable));
});
router.post("/admin/projects", async (req, res) => {
  const parsed = insertProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [created] = await db.insert(projectsTable).values(parsed.data).returning();
  res.status(201).json(created);
});
router.put("/admin/projects/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = insertProjectSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [updated] = await db
    .update(projectsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(projectsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});
router.delete("/admin/projects/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  res.json({ success: true });
});

router.get("/admin/team", async (_req, res) => {
  res.json(await db.select().from(teamTable));
});
router.post("/admin/team", async (req, res) => {
  const parsed = insertTeamSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [created] = await db.insert(teamTable).values(parsed.data).returning();
  res.status(201).json(created);
});
router.put("/admin/team/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = insertTeamSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }
  const [updated] = await db
    .update(teamTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(teamTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});
router.delete("/admin/team/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(teamTable).where(eq(teamTable.id, id));
  res.json({ success: true });
});

router.get("/admin/messages", async (_req, res) => {
  const rows = await db
    .select()
    .from(messagesTable)
    .orderBy(desc(messagesTable.createdAt));
  res.json(rows);
});

router.put("/admin/messages/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { status, adminReply } = req.body ?? {};
  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (status === "new" || status === "read" || status === "replied") {
    update["status"] = status;
  }
  if (typeof adminReply === "string") {
    update["adminReply"] = adminReply;
    update["repliedAt"] = new Date();
    update["status"] = "replied";
  }
  const [updated] = await db
    .update(messagesTable)
    .set(update as never)
    .where(eq(messagesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});

router.delete("/admin/messages/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(messagesTable).where(eq(messagesTable.id, id));
  res.json({ success: true });
});

router.get("/admin/attendance", async (_req, res) => {
  const rows = await db
    .select()
    .from(attendanceTable)
    .orderBy(desc(attendanceTable.checkInTime));
  res.json(rows);
});

router.get("/admin/settings", async (_req, res) => {
  let [settings] = await db.select().from(settingsTable).limit(1);
  if (!settings) {
    [settings] = await db.insert(settingsTable).values({}).returning();
  }
  res.json(settings ?? {});
});

router.put("/admin/settings", async (req, res) => {
  const parsed = insertSettingsSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid settings", issues: parsed.error.issues });
    return;
  }
  let [existing] = await db.select().from(settingsTable).limit(1);
  if (!existing) {
    [existing] = await db
      .insert(settingsTable)
      .values(parsed.data as never)
      .returning();
    res.json(existing);
    return;
  }
  const [updated] = await db
    .update(settingsTable)
    .set({ ...parsed.data, updatedAt: new Date() } as never)
    .where(eq(settingsTable.id, existing.id))
    .returning();
  res.json(updated);
});

export default router;
