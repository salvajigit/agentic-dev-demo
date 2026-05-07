import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validate';

const router = Router();

// In-memory store for demo
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user' },
  { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: 'moderator' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'user' },
];

// GET /api/users — returns all users (no pagination yet — DEMO-143 will fix this)
router.get('/', (_req: Request, res: Response) => {
  res.json(users);
});

// GET /api/users/:id
router.get('/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /api/users — BUG: crashes on empty payload (DEMO-142 will fix this)
router.post('/', validate, (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  const newUser = { id: users.length + 1, name, email, role: role || 'user' };
  users.push(newUser);
  res.status(201).json(newUser);
});

// DELETE /api/users/:id
router.delete('/:id', (req: Request, res: Response) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(idx, 1);
  res.json({ success: true });
});

export { router as usersRouter };
