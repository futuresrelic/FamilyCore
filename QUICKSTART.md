# ⚡ FamilyCore Quick Start Guide

Get FamilyCore running in 5 minutes!

---

## Prerequisites

Install these first if you don't have them:

- **Node.js** 18+: https://nodejs.org/
- **Python** 3.10+: https://www.python.org/
- **PostgreSQL** 14+: https://www.postgresql.org/
- **Git**: https://git-scm.com/

---

## 🚀 Quick Setup (5 Minutes)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/familycore.git
cd familycore
```

### 2. Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Create PostgreSQL database
createdb familycore

# Seed database with sample data
python seed_data.py

# Run backend
python main.py
```

✅ Backend running on http://localhost:8000

### 3. Frontend Setup (2 minutes)

Open a NEW terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Expo
npm start
```

✅ Expo DevTools will open in your browser

### 4. Run the App

- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal
- **Physical Device**: Scan QR code with Expo Go app

### 5. Login

Use the seeded test account:

```
Email: parent@example.com
Password: password123
```

---

## 🎉 You're Done!

The app is now running with sample data:
- 3 kids (Emma, Noah, Sophia)
- Multiple chores
- Reward store
- Calendar events

---

## 🔧 Troubleshooting

### Backend Issues

**Database connection error:**
```bash
# Make sure PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep familycore
```

**Module not found:**
```bash
# Ensure virtual environment is activated
which python  # Should show venv path

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**Metro bundler error:**
```bash
# Clear Expo cache
expo start -c

# Or manually clear
rm -rf node_modules .expo
npm install
```

**Can't connect to backend:**
- Make sure backend is running on port 8000
- Check `services/api.ts` has correct URL
- Try restarting both frontend and backend

---

## 📱 Next Steps

### Explore the App

**Parent Mode:**
1. View dashboard with analytics
2. Create new chores
3. Approve completed chores
4. Check AI insights
5. Manage rewards

**Kid Mode:**
1. Switch to kid profile
2. View assigned chores
3. Complete chores
4. Earn points
5. Browse rewards

### Customize

1. **Add your own kids:**
   - Parent Dashboard → "+ Add Kid"

2. **Create custom chores:**
   - Manage Chores → "Create Chore"

3. **Set up rewards:**
   - Rewards Store → "Add Reward"

4. **Try AI features:**
   - Dashboard → "AI Insights"
   - Let AI suggest chores

---

## 🔐 API Endpoints

Test with curl or Postman:

```bash
# Health check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"parent@example.com","password":"password123"}'

# Get kids (requires token)
curl http://localhost:8000/api/v1/kids/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Full API docs: http://localhost:8000/docs

---

## 📚 Learn More

- **README.md** - Full documentation
- **DEPLOYMENT.md** - Production deployment guide
- **docs/** - Additional guides

---

## 💬 Get Help

- Check logs in terminal
- Review error messages
- Search issues on GitHub
- Read full README.md

---

**Happy organizing! 🏠✨**

Now explore the app and make it your own!
