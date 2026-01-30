import type { Request, Response, NextFunction } from 'express'
import { verifyToken, type JwtPayload } from '../utils/jwt.ts'
import type { NewExpression } from 'typescript'

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload,
};

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ messsage: 'Bad request' });
        }

        const payload = await verifyToken(token)
        req.user = payload;
        next();

    } catch (error) {
        console.error("Forbidden")
        res.status(403).json({ error: "forbidden" });
    }
}