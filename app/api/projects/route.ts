import { NextResponse } from "next/server";
import path from "path";
import { createProject, listProjects, projectsRoot, renameProject, resolveProject } from "@/lib/projects";
import { moveSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Every reel this studio has made, newest first. */
export async function GET() {
  return NextResponse.json({ projects: listProjects() });
}

/**
 * Start a new reel.
 *
 * The client calls this the moment the first file is dropped or the first
 * message is sent — not when the app is opened. Opening the studio shows an
 * empty project because that is what you came to make, but a folder that exists
 * because someone opened a tab is litter, and a picker full of litter is worse
 * than no picker.
 */
export async function POST(req: Request) {
  let name: string | undefined;
  try {
    const body = (await req.json()) as { name?: unknown };
    if (typeof body.name === "string") name = body.name;
  } catch {
    // No body is fine — the name is optional.
  }

  try {
    return NextResponse.json({ slug: createProject(name) });
  } catch {
    return NextResponse.json({ error: "Could not make the project folder." }, { status: 500 });
  }
}

/**
 * Rename a project: `PATCH /api/projects?p=<slug>` with `{ name }`.
 *
 * The folder is renamed on disk, so the new slug comes back and the client has
 * to adopt it — every other request names its project, and the old name is now
 * a 404. A live agent session follows the folder rather than being dropped.
 */
export async function PATCH(req: Request) {
  const slug = new URL(req.url).searchParams.get("p");
  const before = slug ? resolveProject(slug) : null;
  if (!slug || !before) {
    return NextResponse.json({ error: "No such project." }, { status: 404 });
  }

  let name = "";
  try {
    const body = (await req.json()) as { name?: unknown };
    if (typeof body.name === "string") name = body.name;
  } catch {
    // Falls through to the empty-name check.
  }
  if (!name.trim()) {
    return NextResponse.json({ error: "A name is required." }, { status: 400 });
  }

  let next: string | null;
  try {
    next = renameProject(slug, name);
  } catch {
    return NextResponse.json({ error: "Could not rename the folder." }, { status: 500 });
  }
  if (!next) {
    return NextResponse.json({ error: "That name has no letters in it." }, { status: 400 });
  }

  moveSession(before, path.join(projectsRoot(), next));
  return NextResponse.json({ slug: next });
}
