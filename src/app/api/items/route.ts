import { nanoid } from "nanoid";

import { NextRequest, NextResponse } from "next/server";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import { getAllNodes } from "@utils/neo4j_utils";

import {
  CreateItemReqSchema,
  UserIdSchema,
} from "@models/exports";

import { createContentMentions } from "@middleware/content_mentions/exports";

/**
 * Create Item
 */
export async function POST(req: NextRequest) {
  try {
    const { title, content } = CreateItemReqSchema.parse(
      await req.json()
    );

    const userId = UserIdSchema.parse(
      req.headers.get("user_id")
    );
    
    console.log(userId)

    const extId = nanoid(NANOID_SIZE);

    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (u:User{ ext_id: $userId })

          CREATE   (u)
                  -[:CREATED]
                 ->(i:Item{
                     created_at:  TIMESTAMP(),
                     deleted:     FALSE,
                     ext_id:      $extId,
                     title:       $title,
                     content:     $content,
                     points_up:   0,
                     points_down: 0,
                     points:      0
                   })
          
          RETURN i
        `,
        { extId, userId, title, content }
      )
    );

    const nodes = getAllNodes(results);

    const itemId = parseInt(nodes.first().id as string);
    await createContentMentions(content, userId, itemId);

    return NextResponse.json({ nodes });
  } catch (e) {
    console.error(e);

    return new NextResponse("Not able to create the item", {
      status: 500,
    });
  }
}
