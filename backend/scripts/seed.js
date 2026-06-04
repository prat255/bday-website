import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

const websitePassword = process.env.SEED_WEBSITE_PASSWORD || 'birthday123';
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

async function seed() {
  const websiteHash = await bcrypt.hash(websitePassword, 10);
  const adminHash = await bcrypt.hash(adminPassword, 10);

  await fs.writeFile(
    path.join(dataDir, 'config.json'),
    JSON.stringify({ websitePasswordHash: websiteHash }, null, 2)
  );

  await fs.writeFile(
    path.join(dataDir, 'admin.json'),
    JSON.stringify(
      {
        username: process.env.ADMIN_USERNAME || 'admin',
        passwordHash: adminHash,
      },
      null,
      2
    )
  );

  console.log('Seed complete.');
  console.log('Website password:', websitePassword);
  console.log('Admin username:', process.env.ADMIN_USERNAME || 'admin');
  console.log('Admin password:', adminPassword);
}

seed().catch(console.error);
