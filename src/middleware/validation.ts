import type { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validateBody = <T>(schema: ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        } catch (e) {
            if (e instanceof ZodError) {
                res.status(400).json({
                    message: "Invalid Input",
                    details: e.issues.map(issues => ({
                        field: issues.path.join('.'),
                        message: issues.message
                    }))
                })
            }
            next(e);
        }
    }
}


export const validateParams = <T>(schema: ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (e) {
            if (e instanceof ZodError) {
                res.status(400).json({
                    message: "Invalid parameters",
                    details: e.issues.map(issues => ({
                        field: issues.path.join('.'),
                        message: issues.message
                    }))
                })
            }
            next(e);
        }
    }
}


export const validateQuery = <T>(schema: ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (e) {
            if (e instanceof ZodError) {
                res.status(400).json({
                    message: "Invalid query",
                    details: e.issues.map(issues => ({
                        field: issues.path.join('.'),
                        message: issues.message
                    }))
                })
            }
            next(e);
        }
    }
}