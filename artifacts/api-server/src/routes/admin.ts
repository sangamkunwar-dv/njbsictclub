import { Router, type IRouter } from "express";
import { count, desc, eq, sql } from "drizzle-orm";
import {
  db,
  usersTable,
  eventsTable,
  projectsTable,
  teamTable,
  messagesTable,
  attendanceTable,
  settingsTable,
  insertSettingsSchema,
} from "@workspace/db";
import { requireAdmin, hashPassword, generateUserId } from "../lib/auth";
import {
  serializeUser,
  serializeEvent,
  serializeProject,
  serializeTeam,
  serializeMessage,
  serializeSettings,
  serializeAttendance,
  eventInputFromBody,
  projectInputFromBody,
  teamInputFromBody,
  userUpdateFromBody,
  pickDefined,
} from "../lib/serialize";

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
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));
  res.json(users.map(serializeUser));
});

router.post("/admin/users", async (req, res) => {
  const { email, password, fullName, full_name, role } = req.body ?? {};
  if (typeof email !== "string") {
    res.status(400).json({ error: "Email is required" });
    return;
  }
  const passwordHash =
    typeof password === "string" && password.length >= 6
      ? await hashPassword(password)
      : null;
  const [created] = await db
    .insert(usersTable)
    .values({
      email: email.toLowerCase(),
      password: passwordHash,
      fullName: (fullName ?? full_name) ?? null,
      role: (role as "member" | "organizer" | "admin" | undefined) ?? "member",
      oauthProvider: "email",
      userId: generateUserId(),
    })
    .returning();
  if (!created) {
    res.status(500).json({ error: "Failed to create user" });
    return;
  }
  res.status(201).json(serializeUser(created));
});

router.put("/admin/users/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const update = pickDefined(userUpdateFromBody(req.body));
  if (Object.keys(update).length === 0) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }
  const [updated] = await db
    .update(usersTable)
    .set({ ...update, updatedAt: new Date() })
    .where(eq(usersTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(serializeUser(updated));
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
  const rows = await db
    .select()
    .from(eventsTable)
    .orderBy(desc(eventsTable.eventDate));
  res.json(rows.map(serializeEvent));
});
router.post("/admin/events", async (req, res) => {
  const input = eventInputFromBody(req.body);
  if (!input.title || !input.eventDate) {
    res.status(400).json({ error: "title and event_date are required" });
    return;
  }
  const [created] = await db
    .insert(eventsTable)
    .values({
      title: input.title,
      description: input.description,
      eventDate: input.eventDate,
      location: input.location,
      capacity: input.capacity,
      eventType: input.eventType,
      imageUrl: input.imageUrl,
    })
    .returning();
  res.status(201).json(created ? serializeEvent(created) : null);
});
router.put("/admin/events/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const input = pickDefined(eventInputFromBody(req.body));
  if (Object.keys(input).length === 0) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }
  const [updated] = await db
    .update(eventsTable)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(eventsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(serializeEvent(updated));
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
  const rows = await db
    .select()
    .from(projectsTable)
    .orderBy(desc(projectsTable.createdAt));
  res.json(rows.map(serializeProject));
});
router.post("/admin/projects", async (req, res) => {
  const input = projectInputFromBody(req.body);
  if (!input.name) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const [created] = await db
    .insert(projectsTable)
    .values({
      name: input.name,
      description: input.description,
      status: input.status ?? "active",
      startDate: input.startDate,
      endDate: input.endDate,
      technologies: input.technologies,
      githubUrl: input.githubUrl,
      demoUrl: input.demoUrl,
    })
    .returning();
  res.status(201).json(created ? serializeProject(created) : null);
});
router.put("/admin/projects/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const input = pickDefined(projectInputFromBody(req.body));
  if (Object.keys(input).length === 0) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }
  const [updated] = await db
    .update(projectsTable)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(projectsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(serializeProject(updated));
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
  const rows = await db.select().from(teamTable);
  res.json(rows.map(serializeTeam));
});
router.post("/admin/team", async (req, res) => {
  const input = teamInputFromBody(req.body);
  if (!input.name || !input.position) {
    res.status(400).json({ error: "name and position are required" });
    return;
  }
  const [created] = await db
    .insert(teamTable)
    .values({
      name: input.name,
      position: input.position,
      email: input.email,
      phone: input.phone,
      bio: input.bio,
      imageUrl: input.imageUrl,
      socialLinks: input.socialLinks,
      skills: input.skills,
    })
    .returning();
  res.status(201).json(created ? serializeTeam(created) : null);
});
router.put("/admin/team/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const input = pickDefined(teamInputFromBody(req.body));
  if (Object.keys(input).length === 0) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }
  const [updated] = await db
    .update(teamTable)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(teamTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(serializeTeam(updated));
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
  res.json(rows.map(serializeMessage));
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
  res.json(serializeMessage(updated));
});

router.post("/admin/messages/:id/reply", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { adminReply, reply } = req.body ?? {};
  const replyText = (adminReply ?? reply) as string | undefined;
  if (typeof replyText !== "string" || replyText.trim() === "") {
    res.status(400).json({ error: "adminReply is required" });
    return;
  }
  const [updated] = await db
    .update(messagesTable)
    .set({
      adminReply: replyText,
      repliedAt: new Date(),
      status: "replied",
      updatedAt: new Date(),
    })
    .where(eq(messagesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const serialized = serializeMessage(updated);
  res.json({
    success: true,
    email: updated.email,
    message: serialized,
    data: { email: updated.email, message: serialized },
  });
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
    .select({
      attendance: attendanceTable,
      user: usersTable,
      event: eventsTable,
    })
    .from(attendanceTable)
    .leftJoin(usersTable, eq(usersTable.id, attendanceTable.userId))
    .leftJoin(eventsTable, eq(eventsTable.id, attendanceTable.eventId))
    .orderBy(desc(attendanceTable.checkInTime));
  res.json(
    rows.map((r) => serializeAttendance(r.attendance, r.user, r.event)),
  );
});

router.get("/admin/settings", async (_req, res) => {
  let [settings] = await db.select().from(settingsTable).limit(1);
  if (!settings) {
    [settings] = await db.insert(settingsTable).values({}).returning();
  }
  res.json(settings ? serializeSettings(settings) : {});
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
    res.json(existing ? serializeSettings(existing) : {});
    return;
  }
  const [updated] = await db
    .update(settingsTable)
    .set({ ...parsed.data, updatedAt: new Date() } as never)
    .where(eq(settingsTable.id, existing.id))
    .returning();
  res.json(updated ? serializeSettings(updated) : {});
});

void sql;

export default router;
