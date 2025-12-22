# Chat Mate

An AI conversation companion for language learners. Practice English through natural conversations with AI characters at your skill level.

## Features

- **Multiple Characters**: Chat with Emma (coffee enthusiast) or Marcus (tech nomad in Tokyo)
- **Skill Levels**: Beginner, Intermediate, and Advanced difficulty
- **Smart Hints**: Get vocabulary suggestions to help form responses
- **Chat Persistence**: Conversations are saved locally and resume where you left off
- **Multi-language UI**: Interface available in English, Chinese, and Japanese
- **Rate Limit Handling**: Supports multiple API keys with automatic fallback

## Tech Stack

- **Frontend**: Vue 3 + Vite
- **Backend**: Node.js/Express (local) or Google Apps Script (deployed)
- **AI**: Google Gemini 2.5-flash API
- **Deployment**: GitHub Pages (frontend) + Google Apps Script (backend)

## Project Structure

```
chat_mate/
├── frontend/           # Vue 3 + Vite app
│   ├── src/
│   │   ├── components/ # Vue components
│   │   ├── i18n/       # Translations (en, zh, ja)
│   │   └── App.vue
│   └── vite.config.js
├── backend/
│   ├── server.js       # Express server for local dev
│   ├── Code.gs         # Google Apps Script for deployment
│   └── SETUP.md        # Backend deployment guide
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions for gh-pages
```

## Local Development

### 1. Get a Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Create and copy your API key

### 2. Run Backend

```bash
cd backend
npm install

# Create .env file
echo "GEMINI_API_KEYS=your-api-key-here" > .env

# Start server
npm start
```

Server runs at http://localhost:3000

### 3. Run Frontend

```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3000/chat" > .env

# Start dev server
npm run dev
```

Open http://localhost:5173

## Deployment

### Frontend (GitHub Pages)

1. Push to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/chat_mate.git
   git push -u origin master
   ```

2. Enable GitHub Pages:
   - Go to repo Settings > Pages
   - Source: `gh-pages` branch

The GitHub Action will automatically build and deploy on push to master.

### Backend (Google Apps Script)

See [backend/SETUP.md](backend/SETUP.md) for detailed instructions.

Quick steps:
1. Create a project at https://script.google.com
2. Copy `backend/Code.gs` content
3. Add `GEMINI_API_KEY` in Script Properties
4. Deploy as Web App
5. Update frontend's `VITE_API_URL` with the deployed URL

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEYS=key1,key2   # Comma-separated for fallback
PORT=3000                    # Optional, defaults to 3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/chat  # Or your deployed URL
```

## License

MIT
