import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

async function readJson(filename, fallback = null) {
  const filePath = path.join(dataDir, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT' && fallback !== null) return fallback;
    throw err;
  }
}

async function writeJson(filename, data) {
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getConfig() {
  return readJson('config.json', { websitePasswordHash: '' });
}

export async function saveConfig(config) {
  await writeJson('config.json', config);
}

export async function getAdmin() {
  return readJson('admin.json', null);
}

export async function saveAdmin(admin) {
  await writeJson('admin.json', admin);
}

export async function getMemories() {
  const memories = await readJson('memories.json', []);
  return memories.sort((a, b) => a.order - b.order);
}

export async function saveMemories(memories) {
  await writeJson('memories.json', memories);
}

export function getNextMemoryId(memories) {
  if (!memories.length) return 1;
  return Math.max(...memories.map((m) => Number(m.id))) + 1;
}

const DEFAULT_MESSAGE = {
  heading: 'Happy Birthday ❤️',
  message:
    'On this beautiful day, I want you to know how deeply loved, cherished, and celebrated you are. Every moment with you is a gift.',
  thanksMessage: 'Thank you for being part of my life.',
};

export async function getMessage() {
  return readJson('message.json', DEFAULT_MESSAGE);
}

export async function saveMessage(content) {
  await writeJson('message.json', content);
}
