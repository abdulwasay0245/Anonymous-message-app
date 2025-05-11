import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(3, "Username must contain atleast 3 characters")
    .max(20, "Username should be less than 20 characters")
    .regex(/^[a-zA-Z0-0_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must contain at least 6 characters")
})