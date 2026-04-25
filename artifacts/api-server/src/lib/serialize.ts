import type {
  User,
  Event,
  Project,
  TeamMember,
  Message,
  Settings,
  Attendance,
} from "@workspace/db";

export const serializeUser = (u: User) => ({
  _id: u.id,
  id: u.id,
  email: u.email,
  full_name: u.fullName,
  fullName: u.fullName,
  role: u.role,
  avatar: u.avatar,
  avatar_url: u.avatar,
  oauthProvider: u.oauthProvider,
  qrCode: u.qrCode,
  userId: u.userId,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

export const serializeEvent = (e: Event) => ({
  _id: e.id,
  id: e.id,
  title: e.title,
  description: e.description,
  event_date: e.eventDate,
  date: e.eventDate,
  eventDate: e.eventDate,
  location: e.location,
  capacity: e.capacity,
  event_type: e.eventType,
  type: e.eventType,
  eventType: e.eventType,
  image_url: e.imageUrl,
  imageUrl: e.imageUrl,
  createdAt: e.createdAt,
  updatedAt: e.updatedAt,
});

const splitTechnologies = (value: string | null | undefined): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

export const serializeProject = (p: Project) => {
  const techArray = splitTechnologies(p.technologies);
  return {
    _id: p.id,
    id: p.id,
    name: p.name,
    title: p.name,
    description: p.description,
    status: p.status,
    startDate: p.startDate,
    endDate: p.endDate,
    technologies: techArray,
    technologiesText: p.technologies,
    github_url: p.githubUrl,
    githubUrl: p.githubUrl,
    github: p.githubUrl,
    demo_url: p.demoUrl,
    demoUrl: p.demoUrl,
    link: p.demoUrl,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

export const serializeTeam = (t: TeamMember) => ({
  _id: t.id,
  id: t.id,
  name: t.name,
  position: t.position,
  role: t.position,
  email: t.email,
  phone: t.phone,
  bio: t.bio,
  avatar: t.imageUrl,
  image_url: t.imageUrl,
  imageUrl: t.imageUrl,
  social_links: t.socialLinks,
  github: t.socialLinks?.github ?? null,
  twitter: t.socialLinks?.twitter ?? null,
  linkedin: t.socialLinks?.linkedin ?? null,
  website: t.socialLinks?.website ?? null,
  skills: t.skills ?? [],
  joinDate: t.joinDate,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});

export const serializeMessage = (m: Message) => ({
  _id: m.id,
  id: m.id,
  name: m.name,
  email: m.email,
  subject: m.subject,
  message: m.message,
  status: m.status,
  adminReply: m.adminReply,
  repliedAt: m.repliedAt,
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
});

export const serializeSettings = (s: Settings) => ({
  _id: s.id,
  id: s.id,
  clubName: s.clubName,
  clubEmail: s.clubEmail,
  clubDescription: s.clubDescription,
  primaryColor: s.primaryColor,
  secondaryColor: s.secondaryColor,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

export const serializeAttendance = (
  a: Attendance,
  user: User | null,
  event: Event | null,
) => ({
  _id: a.id,
  id: a.id,
  userId: user
    ? { _id: user.id, full_name: user.fullName, email: user.email }
    : null,
  eventId: event ? { _id: event.id, title: event.title } : null,
  checkInTime: a.checkInTime,
  status: a.status,
  createdAt: a.createdAt,
});

const pick = <T extends object, K extends string>(
  source: Record<string, unknown>,
  ...keys: K[]
): Partial<T> => {
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    if (source[k] !== undefined) out[k] = source[k];
  }
  return out as Partial<T>;
};

export const eventInputFromBody = (body: unknown) => {
  const b = (body ?? {}) as Record<string, unknown>;
  const eventDate = b["eventDate"] ?? b["event_date"] ?? b["date"];
  return {
    title: b["title"] as string | undefined,
    description: (b["description"] as string | undefined) ?? null,
    eventDate: eventDate ? new Date(eventDate as string) : undefined,
    location: (b["location"] as string | undefined) ?? null,
    capacity:
      b["capacity"] === undefined || b["capacity"] === null || b["capacity"] === ""
        ? null
        : Number(b["capacity"]),
    eventType:
      ((b["eventType"] ?? b["event_type"] ?? b["type"]) as string | undefined) ??
      null,
    imageUrl:
      ((b["imageUrl"] ?? b["image_url"]) as string | undefined) ?? null,
  };
};

export const projectInputFromBody = (body: unknown) => {
  const b = (body ?? {}) as Record<string, unknown>;
  return {
    name: (b["name"] ?? b["title"]) as string | undefined,
    description: (b["description"] as string | undefined) ?? null,
    status:
      (b["status"] as "active" | "completed" | "on-hold" | undefined) ??
      undefined,
    startDate: b["startDate"] ? new Date(b["startDate"] as string) : null,
    endDate: b["endDate"] ? new Date(b["endDate"] as string) : null,
    technologies: (b["technologies"] as string | undefined) ?? null,
    githubUrl:
      ((b["githubUrl"] ?? b["github_url"] ?? b["github"]) as string | undefined) ??
      null,
    demoUrl:
      ((b["demoUrl"] ?? b["demo_url"] ?? b["link"]) as string | undefined) ??
      null,
  };
};

export const teamInputFromBody = (body: unknown) => {
  const b = (body ?? {}) as Record<string, unknown>;
  return {
    name: b["name"] as string | undefined,
    position: (b["position"] ?? b["role"]) as string | undefined,
    email: (b["email"] as string | undefined) ?? null,
    phone: (b["phone"] as string | undefined) ?? null,
    bio: (b["bio"] as string | undefined) ?? null,
    imageUrl:
      ((b["imageUrl"] ?? b["image_url"] ?? b["avatar"]) as string | undefined) ??
      null,
    socialLinks: (b["social_links"] ?? b["socialLinks"]) as
      | { twitter?: string; linkedin?: string; github?: string }
      | undefined,
    skills: Array.isArray(b["skills"])
      ? (b["skills"] as string[])
      : typeof b["skills"] === "string"
        ? (b["skills"] as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
  };
};

export const userUpdateFromBody = (body: unknown) => {
  const b = (body ?? {}) as Record<string, unknown>;
  return {
    email: (b["email"] as string | undefined) ?? undefined,
    fullName: (b["fullName"] ?? b["full_name"]) as string | null | undefined,
    role: (b["role"] as "member" | "organizer" | "admin" | undefined) ?? undefined,
  };
};

export const pickDefined = <T extends object>(input: T): Partial<T> => {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(input) as [keyof T, T[keyof T]][]) {
    if (value !== undefined) out[key] = value;
  }
  return out;
};

void pick;
