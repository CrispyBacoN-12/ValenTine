import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const adminToken = jwt.sign(
    { role: "admin" },
    process.env.ADMIN_JWT_SECRET!,
    { expiresIn: "12h" }
  );

  return NextResponse.json({ adminToken });
}
