import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/schemas/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { ApiError } from "@/lib/exceptions/api-error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const { email, password } = registerSchema.parse(body);

    // Check if utilisateur already exists
    const existingUtilisateur = await prisma.utilisateurs.findUnique({
      where: { email },
    });

    if (existingUtilisateur) {
      throw ApiError.conflict("user with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create utilisateur
    const utilisateur = await prisma.utilisateurs.create({
      data: {
        email,
        mot_de_passe_hash: hashedPassword
      },
    });

    // Remove password from response
    const { mot_de_passe_hash: _, ...utilisateurWithoutPassword } = utilisateur;

    return NextResponse.json(
      {
        message: "user registered successfully",
        utilisateur: utilisateurWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.errors
        },
        { status: 400 }
      );
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          message: error.message,
          errors: error.errors
        },
        { status: error.statusCode }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}