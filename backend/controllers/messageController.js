import { getMessage, saveMessage } from '../utils/fileStore.js';

const DEFAULT_MESSAGE = {
  heading: 'Happy Birthday ❤️',
  message:
    'On this beautiful day, I want you to know how deeply loved, cherished, and celebrated you are. Every moment with you is a gift.',
  thanksMessage: 'Thank you for being part of my life.',
};

export async function getMessageContent(req, res) {
  try {
    const content = await getMessage();
    return res.json(content);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updateMessageContent(req, res) {
  try {
    const { heading, message, thanksMessage } = req.body;
    const current = await getMessage();

    const updated = {
      heading: heading?.trim() || current.heading || DEFAULT_MESSAGE.heading,
      message: message?.trim() || current.message || DEFAULT_MESSAGE.message,
      thanksMessage:
        thanksMessage?.trim() || current.thanksMessage || DEFAULT_MESSAGE.thanksMessage,
    };

    if (!updated.message) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    await saveMessage(updated);
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
