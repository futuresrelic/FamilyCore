# 🪟 FamilyCore - SUPER SIMPLE Windows Guide

**For Windows 11 users who don't code - just 4 steps!**

---

## Before You Start

Install these 3 things (one-time only):

1. **Docker Desktop**: https://www.docker.com/products/docker-desktop/
   - Download and install
   - Restart your computer
   - Open Docker Desktop (it needs to be running)

2. **Node.js**: https://nodejs.org/
   - Download the LTS version
   - Run installer, click "Next" through everything

3. **Make sure Docker Desktop is running**
   - Look for whale icon 🐋 in your system tray (bottom-right)
   - Should say "Docker Desktop is running"

---

## 🚀 Start the App (4 Easy Steps)

### Step 1: Open PowerShell
- Press `Windows Key + X`
- Click "Windows PowerShell" or "Terminal"

### Step 2: Go to FamilyCore Folder
```powershell
cd C:\Users\YourUsername\FamilyCore
```
**Change `YourUsername` to YOUR Windows username!**

Don't know your username? Type this to find it:
```powershell
echo $env:USERNAME
```

### Step 3: Start Backend (Database + API)
Double-click this file:
```
START-WINDOWS.bat
```

Or in PowerShell type:
```powershell
.\START-WINDOWS.bat
```

**Wait 1-2 minutes.** You'll see "BACKEND STARTED SUCCESSFULLY!"

### Step 4: Start Frontend (Mobile App)
Double-click this file:
```
frontend\START-FRONTEND.bat
```

Or in PowerShell type:
```powershell
cd frontend
.\START-FRONTEND.bat
```

When it says "Metro waiting on...", **press W** on your keyboard.

Your browser opens the app! 🎉

---

## 🎮 Login

```
Email: parent@example.com
Password: password123
```

---

## 🛑 Stop the App

1. In the frontend window: Press `Ctrl + C`
2. Double-click: `STOP-WINDOWS.bat`

Or in PowerShell:
```powershell
.\STOP-WINDOWS.bat
```

---

## 🔄 Start Again Later

1. Make sure Docker Desktop is running
2. Double-click `START-WINDOWS.bat`
3. Open new PowerShell, double-click `frontend\START-FRONTEND.bat`
4. Press W

---

## ❓ Having Problems?

### "Docker is not recognized"
- Docker Desktop is not running
- Open Docker Desktop app
- Wait for it to say "Running"

### "Port 8000 already in use"
Something else is using that port:
```powershell
.\STOP-WINDOWS.bat
.\START-WINDOWS.bat
```

### Frontend won't start
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

### Nothing works
Full reset:
```powershell
docker-compose down -v
docker-compose up -d
cd frontend
npm start
```

---

## 📁 Where Are Things?

**Start backend:** `START-WINDOWS.bat` (in main folder)
**Stop everything:** `STOP-WINDOWS.bat` (in main folder)
**Start frontend:** `frontend\START-FRONTEND.bat`

**Backend API:** http://localhost:8000/docs
**Frontend:** Opens automatically when you press W

---

## ✅ Checklist

Before starting:
- [ ] Docker Desktop installed and RUNNING
- [ ] Node.js installed
- [ ] Opened PowerShell
- [ ] Navigated to FamilyCore folder

To start:
- [ ] Run `START-WINDOWS.bat`
- [ ] Wait for "BACKEND STARTED"
- [ ] Run `frontend\START-FRONTEND.bat`
- [ ] Press W when ready
- [ ] Login with parent@example.com / password123

---

## 🎯 That's It!

You should now see the FamilyCore app in your browser with:
- Dashboard showing 3 kids
- Chores and rewards
- Analytics
- Everything working!

Enjoy! 🏠✨

---

## 📞 Quick Commands Reference

**Start everything:**
```powershell
# In main folder
.\START-WINDOWS.bat

# In new PowerShell window
cd frontend
.\START-FRONTEND.bat
```

**Stop everything:**
```powershell
# Press Ctrl+C in frontend window
# Then in main folder:
.\STOP-WINDOWS.bat
```

**Check if backend is running:**
Open browser: http://localhost:8000/docs

**Check Docker containers:**
```powershell
docker ps
```

You should see:
- familycore-backend
- familycore-db

---

**That's all you need! No coding required!** 🎉
