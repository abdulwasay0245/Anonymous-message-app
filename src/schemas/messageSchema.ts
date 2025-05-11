import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().min(10, 'Message is too short').max(300, 'You have reached the limit of 300 characters'),
    createdAt: z.date()
})