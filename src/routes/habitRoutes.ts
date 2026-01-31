import { Router } from 'express';
import { validateBody } from '../middleware/validation.ts';
import { validateParams } from '../middleware/validation.ts';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.ts';
import { createHabits, getAllHabits, updatedHabit } from '../controllers/habitControlller.ts';
import { de } from 'zod/locales';

const habitSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    frequency: z.string(),
    targetCount: z.number(),
    tagId: z.array(z.string()).optional(),
})
const completeParamShema = z.object({
    id: z.string().min(3)
})

const router = Router();

router.use(authenticate);

//fetching all habits
router.get('/', getAllHabits);

//fetching one habit
router.get('/:id', (req, res) => {
    res.json({ message: `got one habit ${req.params.id}` })
})

//creating new habits 
router.post('/', validateBody(habitSchema), createHabits);

router.patch('/:id', updatedHabit);

//deleting a habit
router.delete('/:id', (req, res) => {
    res.json({ message: "deleted one habit" })
})


router.post('/:id/complete', validateParams(completeParamShema), validateBody(habitSchema), (req, res) => {
    res.json({ message: "completed one habit" })
});


export default router;