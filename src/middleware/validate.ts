import { Request, Response, NextFunction } from 'express';

// BUG: Crashes with TypeError when name.trim() is called on undefined
// Ticket DEMO-2 should fix this
export function validate(req: Request, res: Response, next: NextFunction) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty' });
  }

  const { name, email } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'valid email is required' });
  }

  next();
}
