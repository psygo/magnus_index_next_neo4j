import { NextResponse } from "next/server";
import { conn } from "../../lib/db";

export async function POST() {
  try {
    const results = await conn.query(/* sql */ `
      INSERT INTO posts.posts (
          id,
          content
      ) 
      VALUES (
          ${Math.round(Math.random() * 1_000)},
          'content'
      )
      RETURNING id
    `);

    return NextResponse.json({ data: results.rows[0] });
  } catch (e) {
    return new NextResponse(
      "Not able to scrape the website",
      {
        status: 500,
      }
    );
  }
}
