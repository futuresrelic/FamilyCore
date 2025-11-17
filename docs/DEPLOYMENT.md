# 🚀 FamilyCore Deployment Guide

Complete guide for deploying FamilyCore to production.

---

## Table of Contents
1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [CI/CD Setup](#cicd-setup)
6. [Monitoring](#monitoring)

---

## Backend Deployment

### Option 1: Railway.app (Recommended)

**Railway** provides easy deployment with PostgreSQL database included.

1. **Create Railway account:** https://railway.app

2. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login to Railway:**
   ```bash
   railway login
   ```

4. **Initialize project:**
   ```bash
   cd backend
   railway init
   ```

5. **Add PostgreSQL:**
   ```bash
   railway add --database postgresql
   ```

6. **Set environment variables:**
   ```bash
   railway variables set SECRET_KEY=your-secret-key
   railway variables set OPENAI_API_KEY=your-key
   railway variables set STRIPE_SECRET_KEY=your-key
   ```

7. **Deploy:**
   ```bash
   railway up
   ```

8. **Get domain:**
   ```bash
   railway domain
   ```

---

### Option 2: Render.com

1. **Create account:** https://render.com

2. **Create Web Service:**
   - Connect GitHub repository
   - Select `backend` directory
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL Database:**
   - Dashboard → New → PostgreSQL
   - Copy Database URL

4. **Set Environment Variables:**
   ```
   DATABASE_URL=<from-postgresql>
   SECRET_KEY=<generate-secure-key>
   OPENAI_API_KEY=<your-key>
   ANTHROPIC_API_KEY=<your-key>
   STRIPE_SECRET_KEY=<your-key>
   STRIPE_WEBHOOK_SECRET=<your-webhook-secret>
   ```

5. **Deploy:**
   - Render will auto-deploy on git push

---

### Option 3: AWS Lightsail

1. **Create Lightsail instance:**
   - OS: Ubuntu 22.04 LTS
   - Plan: $5/month minimum

2. **SSH into instance:**
   ```bash
   ssh ubuntu@your-instance-ip
   ```

3. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3-pip postgresql nginx
   ```

4. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/familycore.git
   cd familycore/backend
   ```

5. **Set up Python environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

6. **Configure PostgreSQL:**
   ```bash
   sudo -u postgres createuser familycore
   sudo -u postgres createdb familycore
   sudo -u postgres psql
   ALTER USER familycore WITH PASSWORD 'secure-password';
   GRANT ALL PRIVILEGES ON DATABASE familycore TO familycore;
   \q
   ```

7. **Create .env file:**
   ```bash
   nano .env
   ```
   Add your environment variables

8. **Set up systemd service:**
   ```bash
   sudo nano /etc/systemd/system/familycore.service
   ```

   ```ini
   [Unit]
   Description=FamilyCore API
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/familycore/backend
   Environment="PATH=/home/ubuntu/familycore/backend/venv/bin"
   ExecStart=/home/ubuntu/familycore/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000

   [Install]
   WantedBy=multi-user.target
   ```

9. **Start service:**
   ```bash
   sudo systemctl start familycore
   sudo systemctl enable familycore
   ```

10. **Configure Nginx:**
    ```bash
    sudo nano /etc/nginx/sites-available/familycore
    ```

    ```nginx
    server {
        listen 80;
        server_name api.familycore.app;

        location / {
            proxy_pass http://127.0.0.1:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
    ```

11. **Enable site:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/familycore /etc/nginx/sites-enabled/
    sudo systemctl restart nginx
    ```

12. **Set up SSL with Let's Encrypt:**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d api.familycore.app
    ```

---

## Frontend Deployment

### Expo Application Services (EAS)

**EAS** is the official Expo build and submission service.

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure EAS:**
   ```bash
   cd frontend
   eas build:configure
   ```

4. **Update API URL:**
   Edit `services/api.ts`:
   ```typescript
   const API_URL = 'https://api.familycore.app/api/v1';
   ```

5. **Build for iOS:**
   ```bash
   eas build --platform ios
   ```

6. **Build for Android:**
   ```bash
   eas build --platform android
   ```

7. **Submit to App Store:**
   ```bash
   eas submit --platform ios
   ```

   You'll need:
   - Apple Developer account ($99/year)
   - App Store Connect account
   - App bundle identifier

8. **Submit to Play Store:**
   ```bash
   eas submit --platform android
   ```

   You'll need:
   - Google Play Developer account ($25 one-time)
   - Signed APK/AAB

---

### Over-The-Air (OTA) Updates

**OTA updates** let you push updates without App Store review.

1. **Configure EAS Update:**
   ```bash
   eas update:configure
   ```

2. **Publish update:**
   ```bash
   eas update --branch production
   ```

3. **Users get updates automatically** on next app launch

---

## Database Setup

### Production PostgreSQL

#### Recommended: Managed Database

**Railway Database:**
- Automatic backups
- Scaling included
- $5/month

**Render PostgreSQL:**
- Free tier available
- Auto-scaling
- Daily backups

**AWS RDS:**
- Highly scalable
- Multi-AZ support
- Automated backups

#### Database Migration

1. **Backup existing database:**
   ```bash
   pg_dump familycore > backup.sql
   ```

2. **Restore to production:**
   ```bash
   psql $DATABASE_URL < backup.sql
   ```

---

## Environment Variables

### Backend (.env)

```env
# Required
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=<generate-with-openssl-rand-hex-32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# AI Services (at least one)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe (production keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CORS (your frontend domain)
BACKEND_CORS_ORIGINS=["https://app.familycore.com"]
```

### Frontend (app.json)

Update production API URL in `services/api.ts`

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --service backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install Expo CLI
        run: npm install -g eas-cli

      - name: Publish update
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        run: |
          cd frontend
          eas update --branch production --non-interactive
```

---

## Monitoring

### Backend Monitoring

**Sentry** for error tracking:

1. **Install Sentry:**
   ```bash
   pip install sentry-sdk[fastapi]
   ```

2. **Add to main.py:**
   ```python
   import sentry_sdk

   sentry_sdk.init(
       dsn="your-sentry-dsn",
       traces_sample_rate=1.0,
   )
   ```

### Frontend Monitoring

**Sentry for React Native:**

1. **Install:**
   ```bash
   npm install @sentry/react-native
   ```

2. **Initialize:**
   ```typescript
   import * as Sentry from '@sentry/react-native';

   Sentry.init({
     dsn: 'your-sentry-dsn',
   });
   ```

### Database Monitoring

- **Railway**: Built-in metrics
- **Render**: Database dashboard
- **AWS RDS**: CloudWatch metrics

---

## Cron Jobs

For recurring tasks (reminders, cleanup):

### Railway Cron

Create `railway.json`:
```json
{
  "crons": [
    {
      "command": "python scripts/send_reminders.py",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### Render Cron

Add in Render dashboard:
- Job Type: Cron Job
- Command: `python scripts/send_reminders.py`
- Schedule: `0 8 * * *` (8 AM daily)

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database password is strong
- [ ] SECRET_KEY is random and unique
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Stripe webhook signature verified
- [ ] Passwords hashed with bcrypt
- [ ] SQL injection protection (ORM)
- [ ] Input validation enabled

---

## Performance Optimization

1. **Enable database connection pooling**
2. **Add Redis caching** for frequent queries
3. **Use CDN** for static assets
4. **Enable gzip compression**
5. **Optimize images** in mobile app
6. **Implement lazy loading**

---

## Backup Strategy

### Database Backups

**Daily automated backups:**
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**Store in S3:**
```bash
aws s3 cp backup_$(date +%Y%m%d).sql s3://familycore-backups/
```

---

## Scaling Considerations

### When to scale:

- **Backend:** > 1000 req/min
- **Database:** > 80% CPU usage
- **Frontend:** > 10k active users

### Scaling options:

1. **Horizontal scaling:** Add more instances
2. **Vertical scaling:** Upgrade server resources
3. **Database read replicas**
4. **CDN for assets**
5. **Load balancer**

---

## Support & Troubleshooting

### Common Issues

**503 Service Unavailable:**
- Check backend service is running
- Verify database connection

**CORS errors:**
- Update BACKEND_CORS_ORIGINS
- Check API URL in frontend

**Database connection failed:**
- Verify DATABASE_URL format
- Check database is accessible

---

**Deployment Complete! 🎉**

Your FamilyCore app is now live and ready for families worldwide!
