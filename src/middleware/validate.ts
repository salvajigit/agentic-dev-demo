import { Request, Response, NextFunction } from 'express';

// BUG: Crashes with TypeError when name.trim() is called on undefined
// Ticket DEMO-2 should fix this
export function validate(req: Request, res: Response, next: NextFunction) {
  const { name, email } = req.body;

  // BUG: calling .trim() on undefined throws TypeError
  if (name.trim().length === 0) {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'valid email is required' });
  }

  next();
}
