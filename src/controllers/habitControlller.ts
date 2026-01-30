import { db } from "../db/connection.ts";
import { response, type Request, type Response } from "express";
import { habits, habitsTags, tags, enteries } from "../db/schema.ts";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { and, eq, inArray, desc} from "drizzle-orm";

export const createHabits = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {

        const { name, description, frequency, targetCount, tagId } = req.body;

        const result = await db.transaction(async (tx) => {
            const [newHabit] = await tx.insert(habits).values({
                userId: req.user.id,
                name,
                description,
                frequency,
                targetCount,
            }).
            returning();

            if (tagId && tagId.length > 0) {
                const habitTagValues = tagId.map((tagId) => ({
                    habitId: newHabit.id,
                    tagId,
                }));
                await tx.insert(habitsTags).values(habitTagValues);
            }

            return newHabit;
        })

        res.status(201).json({
            message: "Habit created successfully",
            habits: result,
        })

    } catch (error) {
        console.error("Error creating habits: ", error);
        res.status(500).json({
            error: "Internal server error"
        })
    }
}