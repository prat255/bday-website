import { getWishes, saveWishes, getNextWishId } from '../utils/fileStore.js';

export async function submitWish(req, res) {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Wish text is required' });
    }
    if (text.trim().length > 1000) {
      return res.status(400).json({ message: '1000 characters ke andar me likho, agar usse zyada hai toh let me know on signal' });
    }

    const wishes = await getWishes();
    const wish = {
      id: getNextWishId(wishes),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    wishes.unshift(wish);
    await saveWishes(wishes);
    return res.status(201).json(wish);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function listWishes(req, res) {
  try {
    const wishes = await getWishes();
    return res.json(wishes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteWish(req, res) {
  try {
    const id = Number(req.params.id);
    const wishes = await getWishes();
    const index = wishes.findIndex((w) => w.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Wish not found' });
    }

    wishes.splice(index, 1);
    await saveWishes(wishes);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function clearWishes(req, res) {
  try {
    await saveWishes([]);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
