import type { Request, Response } from "express";
import { db } from "../db/connection.ts";
import { users, type NewUser, type User } from "../db/schema.ts";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";
import { eq } from "drizzle-orm";
import { comparePassword } from "../utils/password.ts";

export const register = async (req: Request<any, any, NewUser>, res: Response) => {


    try {
        const { username, email, password, firstName, lastName } = req.body;

        const hashedPassword = await hashPassword(password);

        const [user] = await db.insert(users).values({
            ...req.body,
            password: hashedPassword
        }).returning({
            id: users.id,
            email: users.email,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            createdAt: users.createdAt,
        })

        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username,
        })

        console.log("token", token);

        return res.status(201).json({
            message: "User registered successfully",
            user,
            token
        })
    } catch (error) {
        console.error("Error Regestring user", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username,
        })

        return res.status(200).json({
            message: "User logged in succussufully",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            token
        })

    } catch (e){
        console.error("Error logging in user", e);
        res.status(500).json({message: "Internal server error"});
    }
}