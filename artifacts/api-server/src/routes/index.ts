import { Router, type IRouter, type Request, type Response } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

// Stubbed endpoints for the ICT Club app. These return safe empty responses so
// the frontend renders cleanly without external services (MongoDB, Supabase,
// JWT, OAuth, etc.) configured. Wire real implementations here when those
// services are provisioned.

const ok = (res: Response, body: unknown = {}) => res.status(200).json(body);

// --- Auth ---
router.get("/auth/me", (_req: Request, res: Response) => res.status(401).json({ user: null }));
router.get("/me", (_req: Request, res: Response) => res.status(200).json({ user: null }));
router.post("/auth/login", (_req, res) => ok(res, { user: null, error: "Authentication is not configured in this environment." }));
router.post("/auth/signup", (_req, res) => ok(res, { user: null, error: "Authentication is not configured in this environment." }));
router.post("/auth/logout", (_req, res) => ok(res, { success: true }));
router.post("/auth/forgot-password", (_req, res) => ok(res, { success: true }));
router.post("/auth/reset-password", (_req, res) => ok(res, { success: true }));

// --- Public content ---
router.get("/events", (_req, res) => ok(res, []));
router.get("/events/:id", (_req, res) => res.status(404).json({ error: "Not found" }));
router.get("/projects", (_req, res) => ok(res, []));
router.get("/team", (_req, res) => ok(res, []));
router.post("/contact", (_req, res) => ok(res, { success: true, message: "Thanks! Your message has been received." }));
router.post("/event-register", (_req, res) => ok(res, { success: true }));

// --- Admin ---
router.get("/admin/stats", (_req, res) => ok(res, { totalMembers: 0, totalEvents: 0, totalProjects: 0, totalMessages: 0 }));
router.get("/admin/users", (_req, res) => ok(res, []));
router.get("/admin/team", (_req, res) => ok(res, []));
router.get("/admin/projects", (_req, res) => ok(res, []));
router.get("/admin/messages", (_req, res) => ok(res, []));
router.get("/admin/attendance", (_req, res) => ok(res, []));
router.get("/admin/settings", (_req, res) => ok(res, {}));

export default router;
