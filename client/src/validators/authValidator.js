import {  z } from "zod"

export const registerSchema = z.object({
    name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

    email: z
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password cannot exceed 50 characters"),
});

export const loginSchema = z.object({
    email: z
     .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password cannot exceed 50 characters"),
})