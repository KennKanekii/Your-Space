import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret:
    "sk_dev_3ULavEe20pPRj7KIJFScLnMhpoa8nxfr9_olyof6NX1zSoyBr39xnjQd7t3KsjTk",
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  /**
   * If an unauthenticated user tries to access a room, we return a Unauthorized 403 response
   */
  const authorization = auth();
  const user = await currentUser();

  if (!authorization || !user) {
    return new Response("Unauthorized", {
      status: 403,
    });
  }

  const { room } = await request.json();
  const board = await convex.query(api.board.get, {
    id: room,
  });

  if (board?.orgId !== (await authorization).orgId) {
    return new Response("Unauthorized", { status: 403 });
  }
  const userInfo = {
    name: user.firstName || "Teammate",
    picture: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, { userInfo });
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();

  return new Response(body, {
    status,
  });
}