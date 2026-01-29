import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: "users" })
})

router.get('/:id', (req, res) => {
    res.json({ message: "got one user" })
})

router.put('/:id', (req, res) => {
    res.json({ message: "updated one user" })
})

router.delete('/:id', (req, res) => {
    res.json({ message: "deleted one user" })
});

export default router;