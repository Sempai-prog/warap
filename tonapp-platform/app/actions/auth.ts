"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { login } from "@/lib/auth";
import { signupSchema, loginSchema } from "@/lib/validations";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const validatedFields = signupSchema.safeParse(values);

    if (!validatedFields.success) {
        console.log("Validation failed:", validatedFields.error.flatten().fieldErrors);
        return {
            error: "Données invalides. Veuillez vérifier vos informations.",
        };
    }

    const { firstName, lastName, email, phone, password } = validatedFields.data;

    // Check if seller already exists
    const existingSeller = await prisma.seller.findFirst({
        where: {
            OR: [{ email }, { phone_primary: phone }],
        },
    });

    if (existingSeller) {
        return { error: "Un compte avec cet email ou ce numéro de téléphone existe déjà." };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create seller
    try {
        const seller = await prisma.seller.create({
            data: {
                email,
                phone_primary: phone,
                first_name: firstName,
                last_name: lastName,
                password_hash: passwordHash,
            },
        });

        // Automatically create a shop for the seller
        await prisma.shop.create({
            data: {
                seller_id: seller.id,
                shop_name: `${firstName}'s Shop`,
                slug: `${firstName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
                whatsapp_number: phone,
            },
        });

        await login(seller);
    } catch (e: any) {
        console.error("Signup error:", e);
        if (e.message?.includes("NEXT_REDIRECT")) throw e;
        return { error: `Erreur: ${e.message || "Une erreur est survenue"}` };
    }

    redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Email ou mot de passe invalide." };
    }

    const { email, password } = validatedFields.data;

    const seller = await prisma.seller.findUnique({
        where: { email },
    });

    if (!seller || !(await bcrypt.compare(password, seller.password_hash))) {
        return { error: "Identifiants invalides." };
    }

    await login(seller);
    redirect("/dashboard");
}
