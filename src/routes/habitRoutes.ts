import { Router } from 'express';
import { validateBody } from '../middleware/validation.js';
import { z } from 'zod';

const habitSchema = z.object({
    name: z.string(),
})

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: "habits" })
})

router.get('/:id', (req, res) => {
    res.json({ message: "got one habits" })
})

router.post('/', validateBody(habitSchema),  (req, res) => {
    res.json({ message: "created habits" })
})

router.delete('/:id', (req, res) => {
    res.json({ message: "deleted one habit" })
})

router.post('/:id/complete', (req, res) => {
    res.json({ message: "completed one habit" })
});


export default router;