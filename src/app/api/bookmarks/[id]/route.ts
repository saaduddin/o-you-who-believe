/**
 * Delete Bookmark Proxy API
 * DELETE: Remove a bookmark by ID
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getQfOAuthConfig } from "@/lib/qf-config";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { apiBaseUrl, clientId } = getQfOAuthConfig();
  const { id } = await params;

  const response = await fetch(`${apiBaseUrl}/auth/v1/bookmarks/${id}`, {
    method: "DELETE",
    headers: {
      "x-auth-token": session.accessToken,
      "x-client-id": clientId,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: response.status }
    );
  }

  return NextResponse.json({ success: true });
}
