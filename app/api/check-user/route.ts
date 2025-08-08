import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ exists: false });

    const user = await prisma.utilisateur.findUnique({
      where: { email: email.toLowerCase() },
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
