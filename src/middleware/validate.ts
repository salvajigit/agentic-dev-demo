import { Request, Response, NextFunction } from 'express';

// BUG: This doesn't handle empty/null body — causes 500 error
// Ticket DEMO-142 should fix this
export function validate(req: Request, res: Response, next: NextFunction) {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required and must be a string' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'valid email is required' });
  }

  next();
}
