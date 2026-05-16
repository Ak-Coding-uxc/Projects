require('dotenv').config();

const express = require('express');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const { GoogleGenAI, Modality } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set. Add it to your .env file.');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const uploadDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const fileFilter = (_, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image type. Use JPG, PNG, or WEBP only.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

async function fileToInlineData(filePath, mimeType) {
  const fileBuffer = await fs.readFile(filePath);
  return {
    inlineData: {
      mimeType,
      data: fileBuffer.toString('base64')
    }
  };
}

async function safeDelete(filePath) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore deletion errors.
  }
}

app.post(
  '/api/generate',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'portrait', maxCount: 1 }
  ]),
  async (req, res) => {
    let thumbnailPath;
    let portraitPath;

    try {
      const thumbnailFile = req.files?.thumbnail?.[0];
      const portraitFile = req.files?.portrait?.[0];
      const extraInstructions = (req.body.extraInstructions || '').trim();

      if (!thumbnailFile || !portraitFile) {
        return res.status(400).json({ error: 'Please upload both thumbnail and portrait images.' });
      }

      thumbnailPath = thumbnailFile.path;
      portraitPath = portraitFile.path;

      const thumbnailImagePart = await fileToInlineData(thumbnailPath, thumbnailFile.mimetype);
      const portraitImagePart = await fileToInlineData(portraitPath, portraitFile.mimetype);

      const prompt = `Edit the first image by replacing the face/head of the main person with the face/head from the second uploaded portrait image. Keep the original thumbnail composition, background, pose, clothing, lighting, and overall style. Make the result realistic, natural, and high quality. Blend skin tone, shadows, and facial alignment properly. Follow these extra user instructions: ${extraInstructions || 'No extra instructions provided.'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              thumbnailImagePart,
              portraitImagePart
            ]
          }
        ],
        config: {
          responseModalities: [Modality.IMAGE]
        }
      });

      const parts = response?.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((part) => part.inlineData?.data);

      if (!imagePart) {
        return res.status(502).json({ error: 'Gemini did not return an image. Try again with different images.' });
      }

      res.json({
        image: `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`
      });
    } catch (error) {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ error: error.message });
      }

      if (error?.message?.includes('Invalid image type')) {
        return res.status(400).json({ error: error.message });
      }

      console.error('Generation error:', error);
      return res.status(500).json({ error: 'Failed to process image. Please try again.' });
    } finally {
      await Promise.all([safeDelete(thumbnailPath), safeDelete(portraitPath)]);
    }
  }
);

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }

  if (error?.message?.includes('Invalid image type')) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
