import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getMemories,
  saveMemories,
  getNextMemoryId,
  getConfig,
  saveConfig,
} from '../utils/fileStore.js';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

async function removeImageFile(imagePath) {
  if (!imagePath?.startsWith('/uploads/')) return;
  const filename = path.basename(imagePath);
  const fullPath = path.join(uploadsDir, filename);
  try {
    await fs.unlink(fullPath);
  } catch {
    /* ignore missing files */
  }
}

export async function listMemories(req, res) {
  try {
    const memories = await getMemories();
    return res.json(memories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function createMemory(req, res) {
  try {
    const { text, order } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Memory text is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const memories = await getMemories();
    const id = getNextMemoryId(memories);
    const memory = {
      id,
      image: `/uploads/${req.file.filename}`,
      text: text.trim(),
      order: order !== undefined && order !== '' ? Number(order) : memories.length + 1,
    };

    memories.push(memory);
    await saveMemories(memories.sort((a, b) => a.order - b.order));
    return res.status(201).json(memory);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updateMemory(req, res) {
  try {
    const id = Number(req.params.id);
    const { text, order } = req.body;
    const memories = await getMemories();
    const index = memories.findIndex((m) => m.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    const existing = memories[index];
    if (text !== undefined) existing.text = text.trim();
    if (order !== undefined && order !== '') existing.order = Number(order);

    if (req.file) {
      await removeImageFile(existing.image);
      existing.image = `/uploads/${req.file.filename}`;
    }

    memories[index] = existing;
    await saveMemories(memories.sort((a, b) => a.order - b.order));
    return res.json(existing);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteMemory(req, res) {
  try {
    const id = Number(req.params.id);
    const memories = await getMemories();
    const index = memories.findIndex((m) => m.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    const [removed] = memories.splice(index, 1);
    await removeImageFile(removed.image);
    await saveMemories(memories);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function reorderMemories(req, res) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'items array is required' });
    }

    const memories = await getMemories();
    const updated = memories.map((memory) => {
      const match = items.find((i) => Number(i.id) === memory.id);
      if (match && match.order !== undefined) {
        return { ...memory, order: Number(match.order) };
      }
      return memory;
    });

    await saveMemories(updated.sort((a, b) => a.order - b.order));
    const sorted = await getMemories();
    return res.json(sorted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updateWebsitePassword(req, res) {
  try {
    const { password } = req.body;
    if (!password || password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters' });
    }

    const hash = await bcrypt.hash(password, 10);
    await saveConfig({ websitePasswordHash: hash });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
