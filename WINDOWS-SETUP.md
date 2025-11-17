# 🪟 FamilyCore - Windows 11 Setup Guide

**Easy setup for Windows 11 with Docker Desktop**

No coding required - just copy and paste commands!

---

## ✅ What You Need (Install These First)

### 1. Docker Desktop for Windows
- Download: https://www.docker.com/products/docker-desktop/
- Install and restart your computer
- Open Docker Desktop and make sure it's running (you'll see a whale icon in your taskbar)

### 2. Node.js (for the mobile app)
- Download: https://nodejs.org/ (get the LTS version - currently 20.x)
- Run the installer
- Click "Next" through everything (keep default settings)

### 3. Git (if you don't have it)
- Download: https://git-scm.com/download/win
- Install with default settings

---

## 🚀 Step-by-Step Setup (10 Minutes)

### Step 1: Open PowerShell

1. Press `Windows Key + X`
2. Click "Windows PowerShell" or "Terminal"

---

### Step 2: Navigate to Your Project

Copy and paste this command (change the path if your project is elsewhere):

```powershell
cd C:\Users\YourUsername\FamilyCore
```

**Replace `YourUsername` with your actual Windows username!**

Or if you cloned to Documents:
```powershell
cd $HOME\Documents\FamilyCore
```

---

### Step 3: Start the Backend with Docker

This single command starts PostgreSQL database + FastAPI backend:

```powershell
docker-compose up -d
```

**What this does:**
- Downloads PostgreSQL database (first time only)
- Builds the Python backend
- Creates sample data (3 kids, chores, rewards)
- Starts everything automatically

**Wait about 1-2 minutes for first-time setup.**

---

### Step 4: Check if Backend is Running

Open your web browser and go to:
```
http://localhost:8000/docs
```

You should see the API documentation page! 🎉

---

### Step 5: Install Frontend Dependencies

In the **same PowerShell window**, run:

```powershell
cd frontend
npm install
```

This takes 2-3 minutes. You'll see lots of text scrolling - that's normal!

---

### Step 6: Start the Mobile App

After npm install finishes:

```powershell
npm start
```

A browser window will open with a QR code and options.

---

### Step 7: Run the App

**Option A - On Your Computer (Easiest):**
- In the browser window, press `W` for web
- Or in PowerShell, press `W`
- App opens in browser at http://localhost:19006

**Option B - On Your Phone:**
1. Install "Expo Go" app from App Store (iPhone) or Play Store (Android)
2. Scan the QR code with your phone camera
3. App opens in Expo Go

**Option C - Android Emulator:**
- If you have Android Studio installed
- Press `A` in PowerShell

---

## 🎉 Login to the App

Use these test credentials:

```
Email: parent@example.com
Password: password123
```

Sample data includes:
- 3 kids (Emma, Noah, Sophia)
- 6 chores
- 5 rewards
- Calendar events

---

## 🛑 How to Stop Everything

When you're done:

### Stop Frontend (Mobile App):
- Press `Ctrl + C` in PowerShell

### Stop Backend (Docker):
```powershell
cd ..
docker-compose down
```

---

## 🔄 How to Restart Later

### Start Backend:
```powershell
cd C:\Users\YourUsername\FamilyCore
docker-compose up -d
```

### Start Frontend:
Open **new PowerShell window**:
```powershell
cd C:\Users\YourUsername\FamilyCore\frontend
npm start
```

---

## 📱 View the App

After `npm start`, you have 3 options:

1. **Web Browser** - Press `W`
   - Best for testing
   - Opens at http://localhost:19006

2. **Phone (Expo Go)** - Scan QR code
   - Install "Expo Go" app first
   - Scan QR code in browser
   - Best for real mobile testing

3. **Android Emulator** - Press `A`
   - Need Android Studio installed first

---

## 🔍 Checking if Everything Works

### Check Backend:
Open browser: http://localhost:8000/docs

You should see:
```
FamilyCore API
Interactive API documentation
```

### Check Database:
```powershell
docker-compose ps
```

You should see:
```
familycore-backend    running
familycore-db         running
```

### Check Frontend:
After `npm start`, browser opens automatically with Expo DevTools

---

## ❌ Troubleshooting

### "Docker is not running"
1. Open Docker Desktop
2. Wait for it to say "Running" in bottom-left
3. Try the command again

### "Port 8000 is already in use"
Something else is using that port:
```powershell
docker-compose down
docker-compose up -d
```

### "Port 5432 is already in use"
PostgreSQL is already running:
```powershell
# Stop other PostgreSQL
Stop-Service postgresql
# OR just change the port in docker-compose.yml
```

### Frontend won't start:
```powershell
cd frontend
rm -r node_modules
npm install
npm start
```

### "Cannot connect to backend"
1. Make sure Docker containers are running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Restart: `docker-compose restart`

---

## 📊 Useful Commands

### View backend logs (see what's happening):
```powershell
docker-compose logs -f backend
```
Press `Ctrl + C` to exit

### View database logs:
```powershell
docker-compose logs -f db
```

### Restart everything:
```powershell
docker-compose restart
```

### Reset database (fresh start):
```powershell
docker-compose down -v
docker-compose up -d
```
**Warning:** This deletes all data!

### Stop everything:
```powershell
docker-compose down
```

---

## 🎨 Exploring the App

### Parent Mode:
1. Login with `parent@example.com` / `password123`
2. See dashboard with 3 kids
3. Click "Manage Chores"
4. Click "AI Insights" to generate suggestions
5. Click "Rewards Store"

### Kid Mode:
1. On dashboard, select a kid
2. Switch to kid view
3. See chores assigned to that kid
4. Tap to complete chores
5. Earn points!

---

## 📁 File Locations

**Backend logs:**
```powershell
docker-compose logs backend
```

**Database data:**
Stored in Docker volume (automatic)

**Frontend:**
`C:\Users\YourUsername\FamilyCore\frontend`

---

## 🔐 API Testing

You can test the API directly:

1. Open: http://localhost:8000/docs
2. Click "Try it out" on any endpoint
3. For protected endpoints:
   - First, use `/api/v1/auth/login`
   - Copy the `access_token`
   - Click "Authorize" button (top right)
   - Paste token
   - Now you can test other endpoints

---

## 📞 Still Having Issues?

1. **Make sure Docker Desktop is running** (check system tray)
2. **Check logs:** `docker-compose logs`
3. **Restart everything:**
   ```powershell
   docker-compose down
   docker-compose up -d
   ```
4. **Check Docker status:**
   ```powershell
   docker ps
   ```

---

## ✨ Quick Reference

**Start everything:**
```powershell
# Terminal 1 - Backend
cd C:\Users\YourUsername\FamilyCore
docker-compose up -d

# Terminal 2 - Frontend (new window)
cd C:\Users\YourUsername\FamilyCore\frontend
npm start
```

**Stop everything:**
```powershell
# Stop frontend: Ctrl + C in frontend terminal
# Stop backend:
docker-compose down
```

**View in browser:**
```
Backend API: http://localhost:8000/docs
Frontend: http://localhost:19006 (after npm start, press W)
```

**Login:**
```
Email: parent@example.com
Password: password123
```

---

## 🎉 You're All Set!

The app is now running with:
- ✅ PostgreSQL database in Docker
- ✅ FastAPI backend in Docker
- ✅ React Native frontend (Expo)
- ✅ Sample data loaded
- ✅ Ready to use!

Enjoy exploring FamilyCore! 🏠✨
