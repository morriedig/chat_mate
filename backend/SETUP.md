# Backend Setup Guide

## Step 1: Get Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

## Step 2: Create Google Apps Script Project

1. Go to https://script.google.com
2. Click "New Project"
3. Name it "Chat Mate Backend"

## Step 3: Add the Code

1. Delete any existing code in `Code.gs`
2. Copy the entire contents of `Code.gs` from this folder
3. Paste it into the editor

## Step 4: Add Your API Key

1. Click ⚙️ **Project Settings** (gear icon on left)
2. Scroll to **Script Properties**
3. Click **Add Script Property**
4. Property: `GEMINI_API_KEY`
5. Value: Your API key from Step 1
6. Click **Save**

## Step 5: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click ⚙️ next to "Select type" > Choose **Web app**
3. Configure:
   - Description: "Chat Mate API"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** and allow permissions
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/xxx/exec`)

## Step 6: Connect Frontend

1. Open `frontend/.env` (create if doesn't exist)
2. Add: `VITE_API_URL=https://script.google.com/macros/s/xxx/exec`
3. Replace with your actual Web app URL

## Step 7: Test

Run the frontend:
```bash
cd frontend
npm run dev
```

Select a character and level, then start chatting!

---

## Troubleshooting

### "Error: Invalid API key"
- Check Script Properties has the correct key
- Make sure there are no extra spaces

### "Error: Access denied"
- Re-deploy with "Anyone" access
- Clear browser cache

### CORS errors
- Google Apps Script should handle CORS automatically
- Make sure you're using the `/exec` URL, not `/dev`

### Slow responses
- First request may be slow (cold start)
- Subsequent requests should be faster
