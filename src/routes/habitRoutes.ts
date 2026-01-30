import { Router } from 'express';
import { validateBody } from '../middleware/validation.ts';
import { validateParams } from '../middleware/validation.ts';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.ts';
import { createHabits } from '../controllers/habitControlller.ts';

const habitSchema = z.object({
    name: z.string(),
})

const completeParamShema = z.object({
    id: z.string().min(3)
})

const router = Router();

router.use(authenticate);
router.get('/', (req, res) => {
    res.json({ message: "habits" })
})

router.get('/:id', (req, res) => {
    res.json({ message: `got one habit ${req.params.id}` })
})

router.post('/',, createHabits);

router.delete('/:id', (req, res) => {
    res.json({ message: "deleted one habit" })
})

router.post('/:id/complete', validateParams(completeParamShema), validateBody(habitSchema), (req, res) => {
    res.json({ message: "completed one habit" })
});


export default router;