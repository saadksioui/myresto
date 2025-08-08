import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Check if email exists in DB (example with Prisma)
    const user = await prisma.utilisateur.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      console.log("Message from registered user:", user.email);
    } else {
      console.log("Message from visitor:", email);
    }
    const fullMessage = `${message}\n\nUser type: ${user ? "Registered" : "Visitor"}`;

    // Prepare email content for EmailJS template
    const templateParams = {
      name: name,
      email: email,
      message: fullMessage,
    };

    // Call EmailJS API
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY, // Public key, not secret
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("EmailJS error:", errorText);
      throw new Error("Failed to send email");
    }

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send message, please try again later." },
      { status: 500 }
    );
  }
}
