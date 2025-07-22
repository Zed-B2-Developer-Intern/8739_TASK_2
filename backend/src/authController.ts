import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Simulated user store (in real app, query DB)
const users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
  { id: 2, username: 'editor', password: bcrypt.hashSync('editor123', 10), role: 'editor' },
  { id: 3, username: 'viewer', password: bcrypt.hashSync('viewer123', 10), role: 'viewer' }
];

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '1h',
  });

  res.json({ token });
};
