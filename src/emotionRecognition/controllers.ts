import { Request, Response } from 'express';
import path from 'path';
import { recognizeEmotion, getEmotionHistory } from './service';

export async function recognizeEmotionController(req: Request, res: Response) {
  try {
    console.log("Emotion recog file", req.file);
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const filePath = path.join(req.file.destination, req.file.filename);
    console.log("File path:", filePath);
    const result = await recognizeEmotion(filePath, req.file.filename);

    res.json(result);
  } catch (error: any) {
    console.error('Error in emotion recognition:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getEmotionHistoryController(req: Request, res: Response) {
  try {
    const history = await getEmotionHistory();
    res.json(history);
  } catch (error: any) {
    console.error('Error fetching emotion history:', error);
    res.status(500).json({ error: error.message });
  }
}