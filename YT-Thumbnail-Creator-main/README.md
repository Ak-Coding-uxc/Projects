# Face Swap App (Gemini)

A full-stack web app that swaps the face/head from a portrait image onto a thumbnail image using Google's Gemini model: `gemini-3-pro-image-preview`.

## Features

- Upload thumbnail image
- Upload portrait/head image
- Optional extra instruction text box
- Generate result with Gemini API
- Loading state while processing
- Preview generated image
- Download generated image
- Basic file validation and API error handling
- Temporary upload storage with cleanup after processing

## Project Structure

```text
face-swap-app/
├── server.js
├── package.json
├── .env.example
├── README.md
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── uploads/
```

## Prerequisites

- Node.js 18+
- A Gemini API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from sample:

```bash
cp .env.example .env
```

3. Add your Gemini key in `.env`:

```env
GEMINI_API_KEY=your_real_key_here
PORT=3000
```

## Run

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Then open: `http://localhost:3000`

## How It Works

1. Frontend sends two images + optional extra instructions to `/api/generate`.
2. Backend stores files temporarily in `uploads/` via `multer`.
3. Backend converts both files to base64.
4. Backend calls Gemini (`gemini-3-pro-image-preview`) with editing prompt + both images.
5. Backend returns generated image as a data URL.
6. Frontend displays and allows downloading the output.
7. Uploaded temp files are deleted after each request (success or failure).

## Notes

- Supported image formats: JPG, PNG, WEBP
- Max upload file size: 10MB per file
- API key must never be hardcoded
