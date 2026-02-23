import { z } from "zod";

// Seller Authentication

export const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+237[0-9]{9}$/, "Phone number must be in format +237xxxxxxxxx"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Shop Configuration

export const shopConfigSchema = z.object({
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color code"),
  whatsappNumber: z.string().regex(/^\+237[0-9]{9}$/, "WhatsApp number must be in format +237xxxxxxxxx"),
  momoNumber: z.string().regex(/^\+237[0-9]{9}$/, "MoMo number must be in format +237xxxxxxxxx").optional().or(z.literal("")),
  orangeNumber: z.string().regex(/^\+237[0-9]{9}$/, "Orange Money number must be in format +237xxxxxxxxx").optional().or(z.literal("")),
  deliveryZones: z.array(z.object({
    city: z.string(),
    region: z.string(),
    deliveryDays: z.number(),
    baseFee: z.number().optional(),
  })).optional(),
});

// Product Management

export const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(60, "Title cannot exceed 60 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().min(100, "Price must be at least 100 XAF"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  category: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

// Order Processing

export const orderSchema = z.object({
  customerName: z.string().min(3, "Name must be at least 3 characters"),
  customerPhone: z.string().regex(/^\+237[0-9]{9}$|^\d{9}$/, "Phone number must be valid"),
  deliveryAddress: z.string().min(5, "Please provide a valid delivery address (Quartier)"),
  paymentMethod: z.enum(["momo", "orange_money", "cash_on_delivery"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

// Onboarding Schemas

export const onboardingIdentitySchema = z.object({
  shopName: z.string().min(2, "Le nom de la boutique doit contenir au moins 2 caractères"),
  bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères").optional(),
  logoUrl: z.string().url("URL du logo invalide").optional().or(z.literal("")),
  bannerUrl: z.string().url("URL de la bannière invalide").optional().or(z.literal("")),
});

export const onboardingDesignSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Code couleur invalide (ex: #3B82F6)"),
  typographyStyle: z.enum(["inter_open_sans", "playfair_lato", "poppins_roboto"]),
  layoutType: z.enum(["bento", "list"]),
});

export const onboardingBusinessSchema = z.object({
  momoNumber: z.string().regex(/^\+237[0-9]{9}$/, "Numéro MoMo invalide (+237xxxxxxxxx)").optional().or(z.literal("")),
  orangeNumber: z.string().regex(/^\+237[0-9]{9}$/, "Numéro Orange invalide (+237xxxxxxxxx)").optional().or(z.literal("")),
  whatsappNumber: z.string().regex(/^\+237[0-9]{9}$/, "Numéro WhatsApp invalide (+237xxxxxxxxx)"),
  acceptsCod: z.boolean().default(true),
  deliveryZones: z.array(z.object({
    city: z.string().min(1, "Ville requise"),
    region: z.string().min(1, "Région requise"),
    deliveryDays: z.coerce.number().min(0, "Jours de livraison positifs"),
    baseFee: z.coerce.number().min(0, "Frais de base positifs").optional(),
  })).optional(),
});
