import { z } from "zod";

const createInterviewSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(120, "Title cannot exceed 120 characters"),

    jobRole: z
        .string()
        .trim()
        .min(2, "Job role is required"),

    company: z
        .string()
        .trim()
        .optional(),

    experienceLevel: z.enum([
        "Fresher",
        "Junior",
        "Mid",
        "Senior",
    ]),

    interviewType: z.enum([
        "Frontend",
        "Backend",
        "Full Stack",
        "HR",
        "DSA",
        "System Design",
    ]),

    difficulty: z
        .enum(["Easy", "Medium", "Hard"])
        .optional(),

    techStack: z
        .array(z.string().trim())
        .min(1, "At least one technology is required"),

    totalQuestions: z
        .number()
        .min(5)
        .max(30)
        .optional(),
});

const updateInterviewSchema = z.object({
    title: z.string().trim().min(3).max(120),

    jobRole: z.string().trim().min(2),

    company: z.string().trim().optional(),

    experienceLevel: z.enum([
        "Fresher",
        "Junior",
        "Mid",
        "Senior",
    ]),

    interviewType: z.enum([
        "Frontend",
        "Backend",
        "Full Stack",
        "HR",
        "DSA",
        "System Design",
    ]),

    difficulty: z
        .enum(["Easy", "Medium", "Hard"])
        .optional(),

    techStack: z
        .array(z.string().trim())
        .min(1),

    totalQuestions: z
        .number()
        .min(5)
        .max(30)
        .optional(),
});

export { createInterviewSchema, updateInterviewSchema };