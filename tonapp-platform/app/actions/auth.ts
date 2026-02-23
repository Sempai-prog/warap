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

    try {
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

        // Create seller and shop in a transaction
        const seller = await prisma.$transaction(async (tx) => {
            const newSeller = await tx.seller.create({
                data: {
                    email,
                    phone_primary: phone,
                    first_name: firstName,
                    last_name: lastName,
                    password_hash: passwordHash,
                },
                // Optimization: Select only id and email to reduce data transfer and memory usage
                select: {
                    id: true,
                    email: true,
                },
            });

            // Automatically create a shop for the seller
            await tx.shop.create({
                data: {
                    seller_id: newSeller.id,
                    shop_name: `${firstName}'s Shop`,
                    slug: `${firstName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
                    whatsapp_number: phone,
                },
            });

            return newSeller;
        });

        await login(seller);
    } catch (e: unknown) {
        // Check if it's a redirect error just in case code changes move redirect inside
        if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) {
            throw e;
        }
        console.error("Signup error:", e);
        return { error: "Une erreur est survenue lors de l'inscription." };
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

    try {
        const seller = await prisma.seller.findUnique({
            where: { email },
            // Optimization: Select only necessary fields for authentication to improve performance
            select: {
                id: true,
                email: true,
                password_hash: true,
            },
        });

        if (!seller || !(await bcrypt.compare(password, seller.password_hash))) {
            return { error: "Identifiants invalides." };
        }

        await login(seller);
    } catch (e: unknown) {
        if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) {
            throw e;
        }
        console.error("Login error:", e);
        return { error: "Une erreur est survenue lors de la connexion." };
    }

    redirect("/dashboard");
}
