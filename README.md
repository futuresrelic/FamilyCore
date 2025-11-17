# 🏠 FamilyCore - AI Family Organizer

**A complete, production-ready mobile app for managing family chores, schedules, and rewards with AI-powered insights.**

---

## 📱 Features

### For Parents
- ✅ Manage multiple kids and their profiles
- ✅ Create and assign chores with AI suggestions
- ✅ Track completion rates and analytics
- ✅ Set up reward systems
- ✅ Calendar integration
- ✅ AI-powered family insights and tips
- ✅ Natural language chore creation
- ✅ Premium subscription management

### For Kids
- ✅ Playful, kid-friendly UI
- ✅ View daily tasks and chores
- ✅ Complete chores with one tap
- ✅ Earn points and track streaks
- ✅ Redeem rewards
- ✅ Customize avatar
- ✅ Receive motivational messages

---

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo**
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Zustand** for state management
- **React Query** for server state
- **Reanimated** for animations
- **Lottie** for kid-friendly animations
- **Stripe** for subscriptions

### Backend
- **Python FastAPI** for high-performance API
- **PostgreSQL** database
- **SQLAlchemy** ORM
- **JWT** authentication
- **OpenAI/Anthropic** for AI features
- **Stripe** for payment processing

---

## 📂 Project Structure

```
FamilyCore/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── ai/             # AI engines (chore assignment, insights)
│   │   ├── core/           # Config, database, security
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # FastAPI entry point
│   ├── migrations/         # Database migrations
│   ├── tests/              # Pytest tests
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── frontend/               # React Native + Expo frontend
│   ├── app/                # Expo Router screens
│   │   ├── parent/         # Parent mode screens
│   │   ├── kid/            # Kid mode screens
│   │   ├── login.tsx       # Authentication
│   │   └── register.tsx
│   ├── components/         # Reusable UI components
│   ├── constants/          # Design system & theme
│   ├── services/           # API service layer
│   ├── state/              # Zustand stores
│   ├── hooks/              # Custom React hooks
│   ├── package.json
│   ├── app.json
│   └── tsconfig.json
│
└── docs/                   # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.10+
- **PostgreSQL** 14+
- **Expo CLI**: `npm install -g expo-cli`
- **Git**

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create Python virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/familycore
   SECRET_KEY=your-secret-key-here
   OPENAI_API_KEY=sk-your-openai-key
   ANTHROPIC_API_KEY=sk-ant-your-key
   STRIPE_SECRET_KEY=sk_test_your-key
   ```

5. **Set up PostgreSQL database:**
   ```bash
   # Create database
   createdb familycore

   # Tables will be created automatically on first run
   ```

6. **Run the backend:**
   ```bash
   cd backend
   python main.py
   ```

   Backend will run on `http://localhost:8000`

   API docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Update API URL (if needed):**
   Edit `frontend/services/api.ts`:
   ```typescript
   const API_URL = 'http://localhost:8000/api/v1';
   ```

4. **Run the app:**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Open the app:**
   - **iOS**: Press `i` (requires Xcode)
   - **Android**: Press `a` (requires Android Studio)
   - **Web**: Press `w`
   - **Scan QR**: Use Expo Go app on your phone

---

## 📊 Database Schema

### Users
- Parent accounts with email/password auth
- Subscription status tracking
- 7-day free trial

### Kids
- Multiple kids per parent
- Avatar, points, streak tracking
- Age-appropriate settings

### Chores
- Assigned to specific kids
- Difficulty levels (easy, medium, hard)
- Recurrence (once, daily, weekly, monthly)
- Points and status tracking

### Rewards
- Custom reward store per family
- Point-based redemption
- AI-suggested rewards

### Calendar Events
- Family-wide calendar
- Link to chores
- Recurring events

### AI Insights
- Automated family analytics
- Motivation messages
- Parenting tips

---

## 🤖 AI Features

### 1. Chore Assignment Engine
Automatically assigns chores based on:
- Kid's age and capabilities
- Current workload balance
- Historical patterns
- Fairness distribution

### 2. Schedule Optimizer
- Detects overload
- Suggests optimal timing
- Avoids conflicts

### 3. Natural Language Processing
Create chores with plain English:
```
"Make a weekly trash chore for Emily on Tuesdays"
```

### 4. Family Insights
- Completion rate analysis
- Individual kid performance
- Streak tracking
- Point balance recommendations

### 5. Motivation Messages
Kid-friendly encouragement:
- "You're building an amazing streak!"
- "Great job on your chores today!"

---

## 💳 Monetization

### Free Tier
- 1 parent account
- 1 kid profile
- 20 chores/month
- Basic AI suggestions

### Premium ($4.99/month or $39/year)
- Unlimited kids
- Unlimited chores
- Full AI automation
- Advanced analytics
- Priority support
- All avatars
- Custom rewards

**7-day free trial** for all new users

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📦 Deployment

### Backend Deployment (Railway/Render)

1. **Create account** on Railway.app or Render.com

2. **Connect repository**

3. **Set environment variables:**
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`

4. **Deploy:**
   ```bash
   railway up
   # or
   render deploy
   ```

### Frontend Deployment (Expo/EAS)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS:**
   ```bash
   cd frontend
   eas build:configure
   ```

3. **Build for App Stores:**
   ```bash
   # iOS
   eas build --platform ios

   # Android
   eas build --platform android
   ```

4. **Submit to stores:**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

---

## 🎨 Design System

### Parent Theme
- **Primary**: Deep Blue (#1E3A8A)
- **Secondary**: Bright Blue (#3B82F6)
- **Professional and clean**

### Kid Theme
- **Primary**: Orange (#F59E0B)
- **Secondary**: Pink (#EC4899)
- **Playful and colorful**

### Typography
- Clear hierarchy
- Kid-friendly sizes
- Accessible contrast

---

## 📄 API Documentation

Full API documentation available at:
```
http://localhost:8000/docs
```

### Key Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login

**Kids:**
- `GET /api/v1/kids/` - Get all kids
- `POST /api/v1/kids/` - Create kid
- `PUT /api/v1/kids/{id}` - Update kid
- `DELETE /api/v1/kids/{id}` - Delete kid

**Chores:**
- `GET /api/v1/chores/` - Get chores
- `POST /api/v1/chores/` - Create chore
- `POST /api/v1/chores/{id}/complete` - Complete chore
- `POST /api/v1/chores/{id}/approve` - Approve chore

**AI:**
- `GET /api/v1/ai/chore-suggestions` - Get AI suggestions
- `POST /api/v1/ai/natural-chore` - Natural language chore
- `POST /api/v1/ai/generate-insights` - Generate insights

---

## 🔐 Security

- JWT-based authentication
- Bcrypt password hashing
- HTTPS in production
- Secure environment variables
- Input validation with Pydantic
- SQL injection protection via SQLAlchemy ORM

---

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify `.env` file exists and has correct values
- Ensure virtual environment is activated

### Frontend connection issues
- Update API_URL in `services/api.ts`
- Check backend is running
- Try clearing Expo cache: `expo start -c`

### Database errors
- Ensure PostgreSQL is installed and running
- Check database exists: `psql -l`
- Verify DATABASE_URL format

---

## 📝 License

MIT License - See LICENSE file

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@familycore.app

---

## 🎉 Credits

Built with ❤️ for families everywhere

**Technologies:**
- React Native & Expo
- FastAPI
- PostgreSQL
- OpenAI / Anthropic
- Stripe

---

**Happy Family Organizing! 🏠✨**
