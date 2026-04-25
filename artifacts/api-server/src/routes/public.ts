import { Router, type IRouter } from "express";
import { asc, desc, eq } from "drizzle-orm";
import {
  db,
  eventsTable,
  projectsTable,
  teamTable,
  messagesTable,
  attendanceTable,
  insertMessageSchema,
} from "@workspace/db";
import { readAuthFromRequest } from "../lib/auth";
import {
  serializeEvent,
  serializeProject,
  serializeTeam,
} from "../lib/serialize";

const router: IRouter = Router();

router.get("/events", async (_req, res) => {
  const events = await db
    .select()
    .from(eventsTable)
    .orderBy(asc(eventsTable.eventDate));
  res.json(events.map(serializeEvent));
});

router.get("/events/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid event id" });
    return;
  }
  const [event] = await db
    .select()
    .from(eventsTable)
    .where(eq(eventsTable.id, id))
    .limit(1);
  if (!event) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(serializeEvent(event));
});

router.get("/projects", async (req, res) => {
  const status = req.query["status"];
  const rows = await db
    .select()
    .from(projectsTable)
    .orderBy(desc(projectsTable.createdAt));
  const filtered =
    typeof status === "string" && status !== "all"
      ? rows.filter((p) => p.status === status)
      : rows;
  res.json(filtered.map(serializeProject));
});

router.get("/team", async (_req, res) => {
  const team = await db
    .select()
    .from(teamTable)
    .orderBy(asc(teamTable.joinDate));
  res.json(team.map(serializeTeam));
});

router.post("/contact", async (req, res) => {
  const parsed = insertMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid message", issues: parsed.error.issues });
    return;
  }
  const [created] = await db
    .insert(messagesTable)
    .values(parsed.data)
    .returning();
  res.status(201).json({
    success: true,
    message: "Thanks! Your message has been received.",
    id: created?.id,
  });
});

router.post("/event-register", async (req, res) => {
  const auth = readAuthFromRequest(req);
  if (!auth) {
    res.status(401).json({ error: "You must be signed in to register" });
    return;
  }
  const eventId = Number(req.body?.eventId);
  if (!Number.isFinite(eventId)) {
    res.status(400).json({ error: "eventId is required" });
    return;
  }
  const [event] = await db
    .select({ id: eventsTable.id })
    .from(eventsTable)
    .where(eq(eventsTable.id, eventId))
    .limit(1);
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  await db.insert(attendanceTable).values({
    userId: auth.id,
    eventId,
    status: "present",
  });
  res.json({ success: true });
});

export default router;
