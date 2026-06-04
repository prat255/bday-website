import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConfig, getAdmin } from '../utils/fileStore.js';

export async function verifyPassword(req, res) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const config = await getConfig();
    if (!config.websitePasswordHash) {
      return res.status(500).json({ message: 'Website password not configured. Run seed script.' });
    }

    const valid = await bcrypt.compare(password, config.websitePasswordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await getAdmin();
    if (!admin) {
      return res.status(500).json({ message: 'Admin not configured. Run seed script.' });
    }

    if (username !== admin.username) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({ token, username: admin.username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
