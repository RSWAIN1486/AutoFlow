# AutoFlow Deployment Guide

This guide covers deployment options that support persistent file storage and work with the current application architecture without modifications.

## Platform Recommendations

### ✅ **1. Railway** (Recommended - Easiest)

**Why Railway?**
- Persistent file storage out of the box
- No code changes required
- Simple deployment process
- Affordable pricing

**Deployment Steps:**
1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your AutoFlow repository
5. Railway will automatically detect it's a Next.js app
6. Click "Deploy"

**Configuration:**
- Uses the included `railway.json` file
- Automatically installs dependencies and builds
- Provides persistent storage for `.applications.json` and uploads

**Cost:** Free tier available, then $5/month

---

### ✅ **2. Render** (Great Alternative)

**Why Render?**
- Persistent disk storage
- Built-in SSL certificates
- Easy database integration if needed later
- Good performance

**Deployment Steps:**
1. Visit [render.com](https://render.com)
2. Connect your GitHub account
3. Click "New Web Service"
4. Select your AutoFlow repository
5. Use these settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18 or higher

**Configuration:**
- Uses the included `render.yaml` file
- Includes persistent disk for file storage
- Automatically handles SSL and custom domains

**Cost:** Free tier available, then $7/month

---

### ✅ **3. DigitalOcean App Platform**

**Why DigitalOcean?**
- Reliable infrastructure
- Persistent storage options
- Good documentation
- Predictable pricing

**Deployment Steps:**
1. Visit [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Go to Apps section
3. Click "Create App"
4. Connect your GitHub repository
5. Use the included `.do/app.yaml` configuration

**Configuration:**
- Pre-configured with `.do/app.yaml`
- Supports persistent volumes
- Auto-scaling capabilities

**Cost:** Starting at $5/month

---

### ✅ **4. Heroku** (Traditional Option)

**Why Heroku?**
- Well-established platform
- Easy deployment process
- Good add-on ecosystem

**Deployment Steps:**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-autoflow-app`
4. Deploy: `git push heroku main`

**Note:** Heroku has ephemeral file storage, but you can use add-ons for persistence.

**Cost:** $7/month for basic dyno

---

### ✅ **5. VPS Options** (Most Control)

**Recommended VPS Providers:**
- **Linode:** $5/month
- **DigitalOcean Droplets:** $4/month  
- **Vultr:** $2.50/month
- **AWS Lightsail:** $3.50/month

**Deployment Steps:**
1. Create a VPS instance
2. Install Node.js and npm
3. Clone your repository
4. Install dependencies: `npm install`
5. Build the app: `npm run build`
6. Start with PM2: `pm2 start npm -- start`
7. Set up nginx as reverse proxy (optional)

---

## Quick Start - Railway (Recommended)

Since Railway is the easiest and most compatible with your current setup:

### 1. Prepare Your Repository
```bash
# Ensure your package.json has the start script
npm run build  # Test local build
```

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your AutoFlow repository
5. Railway will automatically:
   - Detect it's a Next.js project
   - Install dependencies
   - Build the application
   - Deploy with persistent storage

### 3. Access Your App
- Railway will provide a URL like `https://autoflow-production-xxxx.up.railway.app`
- Your app will work exactly like localhost
- Files uploaded to `public/uploads` will persist
- Application data in `.applications.json` will persist

## Testing Your Deployment

After deployment, test these key features:
1. **Browse vehicles** at `/inventory`
2. **Submit application** via the form
3. **Upload documents** - verify files are accessible
4. **Admin review** at `/admin/review`
5. **Complete workflow** through delivery

## Environment Variables (If Needed)

If you need to add environment variables later:

**Railway:**
- Go to your project dashboard
- Click "Variables" tab
- Add key-value pairs

**Render:**
- Go to your service dashboard
- Click "Environment" tab
- Add variables

## Database Migration (Future)

When ready to move from JSON files to a database:
- Railway: Built-in PostgreSQL
- Render: PostgreSQL add-on
- DigitalOcean: Managed databases
- Heroku: PostgreSQL add-on

## Troubleshooting

**Build Issues:**
- Ensure `package.json` has correct scripts
- Check Node.js version compatibility
- Verify all dependencies are listed

**File Storage Issues:**
- Check if platform supports persistent storage
- Verify file paths are correct
- Ensure proper permissions

**Performance Issues:**
- Consider upgrading to higher tier
- Implement caching if needed
- Optimize images and assets

---

## Summary

For your current setup, **Railway** is the best choice because:
- ✅ Zero configuration needed
- ✅ Persistent file storage
- ✅ Works exactly like localhost
- ✅ Simple deployment process
- ✅ Affordable pricing

Your application will work immediately without any code modifications! 