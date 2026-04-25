import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  hashPassword,
  verifyPassword,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  readAuthFromRequest,
  generateUserId,
} from "../lib/auth";
import { serializeUser } from "../lib/serialize";

const router: IRouter = Router();

const loadUser = async (id: number) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return user;
};

router.get("/auth/me", async (req, res) => {
  const auth = readAuthFromRequest(req);
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = await loadUser(auth.id);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const serialized = serializeUser(user);
  res.json({ ...serialized, user: serialized });
});

router.get("/me", async (req, res) => {
  const auth = readAuthFromRequest(req);
  if (!auth) {
    res.status(401).json({ user: null });
    return;
  }
  const user = await loadUser(auth.id);
  if (!user) {
    res.status(404).json({ user: null });
    return;
  }
  res.json({ user: serializeUser(user) });
});

router.post("/auth/signup", async (req, res) => {
  const { email, password, fullName, full_name } = req.body ?? {};
  const name = fullName ?? full_name;
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  const existing = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "An account with that email already exists" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const userId = generateUserId();

  const [created] = await db
    .insert(usersTable)
    .values({
      email: email.toLowerCase(),
      password: passwordHash,
      fullName: typeof name === "string" ? name : null,
      role: "member",
      oauthProvider: "email",
      userId,
    })
    .returning();

  if (!created) {
    res.status(500).json({ error: "Failed to create user" });
    return;
  }

  const token = signToken({
    id: created.id,
    email: created.email,
    role: created.role,
  });
  setAuthCookie(res, token);

  res.status(201).json({ user: serializeUser(created) });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  if (!user || !user.password) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  setAuthCookie(res, token);

  res.json({ user: serializeUser(user) });
});

router.post("/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

router.post("/auth/forgot-password", (req, res) => {
  const { email } = req.body ?? {};
  if (typeof email !== "string") {
    res.status(400).json({ error: "Email is required" });
    return;
  }
  res.json({
    success: true,
    message:
      "If an account exists for that email, a password reset link has been sent.",
  });
});

router.post("/auth/reset-password", (_req, res) => {
  res.status(501).json({
    error:
      "Password reset is not enabled in this environment. Please contact an administrator.",
  });
});

const oauthNotConfigured = (
  _req: import("express").Request,
  res: import("express").Response,
) => {
  res.status(501).json({
    error:
      "OAuth sign-in is not configured. Use email and password to log in.",
  });
};

router.get("/auth/callback/google", oauthNotConfigured);
router.get("/auth/callback/github", oauthNotConfigured);
router.post("/auth/callback/google", oauthNotConfigured);
router.post("/auth/callback/github", oauthNotConfigured);

export default router;
