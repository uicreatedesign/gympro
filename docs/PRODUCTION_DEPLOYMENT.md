# 🚀 PRODUCTION DEPLOYMENT GUIDE

## ⚠️ CRITICAL: Read This First

**BACKUP EVERYTHING BEFORE DEPLOYMENT**
- Database backup
- Files backup
- .env file backup
- Current codebase backup

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. Local Testing
- [ ] All migrations run successfully locally
- [ ] No errors in browser console
- [ ] All features tested manually
- [ ] Payment gateway tested (UAT mode)
- [ ] Forms validation working
- [ ] Reports generating correctly

### 2. Code Quality
- [ ] Run `php artisan test` (if tests exist)
- [ ] Run `vendor/bin/pint` (code formatting)
- [ ] Run `npm run lint` (frontend linting)
- [ ] No console.log() in production code
- [ ] No dd() or dump() in production code

### 3. Environment Check
- [ ] .env.production file ready
- [ ] Database credentials correct
- [ ] Redis configured (if using)
- [ ] PhonePe PRODUCTION credentials ready
- [ ] Email service configured
- [ ] APP_DEBUG=false
- [ ] APP_ENV=production

---

## 🔧 DEPLOYMENT COMMANDS

### STEP 1: Backup Production Database

```bash
# SSH into production server
ssh user@your-server-ip

# Navigate to project directory
cd /var/www/gympro

# Backup database
php artisan backup:database
# OR manually:
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup files
tar -czf gympro_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/gympro

# Download backup to local (from your local machine)
scp user@your-server-ip:/var/www/gympro/backup_*.sql ./backups/
```

---

### STEP 2: Put Application in Maintenance Mode

```bash
# Enable maintenance mode
php artisan down --refresh=15 --secret="your-secret-token"

# You can still access via: https://yourdomain.com/your-secret-token
```

---

### STEP 3: Pull Latest Code from Git

```bash
# Stash any local changes (if any)
git stash

# Pull latest code
git pull origin main
# OR if using different branch:
git pull origin production

# Check current branch
git branch

# Check git status
git status
```

---

### STEP 4: Update Dependencies

```bash
# Update Composer dependencies (production mode)
composer install --optimize-autoloader --no-dev

# Update NPM dependencies
npm ci --production
# OR
npm install --production
```

---

### STEP 5: Run Database Migrations

```bash
# Check migration status first
php artisan migrate:status

# Run migrations (CAREFUL!)
php artisan migrate --force

# If you need to seed (ONLY if required)
# php artisan db:seed --force
```

**⚠️ IMPORTANT**: Review migrations before running!
- Check: `database/migrations/2026_01_16_*` files
- These add indexes, soft deletes, and fix data structure

---

### STEP 6: Clear All Caches

```bash
# Clear application cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Clear view cache
php artisan view:clear

# Clear compiled classes
php artisan clear-compiled
```

---

### STEP 7: Optimize for Production

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer dump-autoload --optimize

# Cache events (if using)
php artisan event:cache
```

---

### STEP 8: Build Frontend Assets

```bash
# Build production assets
npm run build

# Verify build folder exists
ls -la public/build

# Check if manifest.json exists
cat public/build/manifest.json
```

---

### STEP 9: Set Correct Permissions

```bash
# Set ownership (adjust user:group as needed)
sudo chown -R www-data:www-data /var/www/gympro

# Set directory permissions
sudo find /var/www/gympro -type d -exec chmod 755 {} \;

# Set file permissions
sudo find /var/www/gympro -type f -exec chmod 644 {} \;

# Storage and cache writable
sudo chmod -R 775 storage bootstrap/cache

# Make artisan executable
sudo chmod +x artisan
```

---

### STEP 10: Restart Services

```bash
# Restart PHP-FPM (adjust version as needed)
sudo systemctl restart php8.2-fpm
# OR
sudo service php8.2-fpm restart

# Restart Nginx
sudo systemctl restart nginx
# OR
sudo service nginx restart

# Restart Queue Workers (if using)
sudo supervisorctl restart gympro-worker:*
# OR
php artisan queue:restart

# Restart Redis (if using)
sudo systemctl restart redis
```

---

### STEP 11: Verify Deployment

```bash
# Check application status
php artisan about

# Check database connection
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit

# Check cache is working
php artisan tinker
>>> Cache::put('test', 'value', 60);
>>> Cache::get('test');
>>> exit

# Check logs for errors
tail -f storage/logs/laravel.log

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

### STEP 12: Bring Application Back Online

```bash
# Disable maintenance mode
php artisan up
```

---

### STEP 13: Post-Deployment Testing

**Test these features immediately:**

1. **Login**
   - [ ] Admin login works
   - [ ] Member login works
   - [ ] 2FA works (if enabled)

2. **Core Features**
   - [ ] Dashboard loads
   - [ ] Members page loads
   - [ ] Subscriptions page loads
   - [ ] Payments page loads
   - [ ] Reports generate

3. **Critical Flows**
   - [ ] Create new member
   - [ ] Create subscription
   - [ ] Mark attendance
   - [ ] Generate report
   - [ ] Member can purchase plan (PhonePe)

4. **Performance**
   - [ ] Pages load in < 2 seconds
   - [ ] No console errors
   - [ ] No 500 errors in logs

---

## 🔥 ROLLBACK PROCEDURE (If Something Goes Wrong)

### Quick Rollback

```bash
# 1. Enable maintenance mode
php artisan down

# 2. Restore database backup
mysql -u username -p database_name < backup_YYYYMMDD_HHMMSS.sql

# 3. Rollback code
git reset --hard HEAD~1
# OR restore from backup
tar -xzf gympro_backup_YYYYMMDD_HHMMSS.tar.gz

# 4. Restore dependencies
composer install --no-dev
npm ci --production

# 5. Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 6. Rebuild assets
npm run build

# 7. Bring back online
php artisan up
```

---

## 📊 MONITORING AFTER DEPLOYMENT

### Check These for 24 Hours

```bash
# Monitor error logs
tail -f storage/logs/laravel.log

# Monitor Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Monitor Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Monitor PHP-FPM logs
sudo tail -f /var/log/php8.2-fpm.log

# Monitor system resources
htop
# OR
top

# Check disk space
df -h

# Check memory usage
free -m
```

### Performance Monitoring

```bash
# Check query performance
php artisan tinker
>>> DB::enableQueryLog();
>>> // Run some queries
>>> DB::getQueryLog();

# Check cache hit rate (if using Redis)
redis-cli info stats
```

---

## 🔐 SECURITY CHECKLIST

### After Deployment

- [ ] Verify APP_DEBUG=false
- [ ] Verify APP_ENV=production
- [ ] Check .env file permissions (600)
- [ ] Verify HTTPS is working
- [ ] Check CORS configuration
- [ ] Verify rate limiting is active
- [ ] Check firewall rules
- [ ] Verify PhonePe webhook signature verification
- [ ] Test 2FA if enabled
- [ ] Check session security settings

---

## 📝 ENVIRONMENT VARIABLES FOR PRODUCTION

### Critical .env Settings

```env
# Application
APP_NAME=GymPro
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gympro_production
DB_USERNAME=gympro_user
DB_PASSWORD=strong_password_here

# Cache & Session (Use Redis in production)
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# PhonePe (PRODUCTION)
PHONEPE_MERCHANT_ID=your_production_merchant_id
PHONEPE_MERCHANT_USER_ID=your_production_merchant_user_id
PHONEPE_SALT_KEY=your_production_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=PRODUCTION

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USERNAME=your_email@domain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

# Security
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
```

---

## 🚨 TROUBLESHOOTING

### Common Issues & Solutions

#### 1. **500 Internal Server Error**
```bash
# Check logs
tail -f storage/logs/laravel.log
sudo tail -f /var/log/nginx/error.log

# Check permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Clear caches
php artisan cache:clear
php artisan config:clear
```

#### 2. **Assets Not Loading**
```bash
# Rebuild assets
npm run build

# Check public/build exists
ls -la public/build

# Check Nginx serves static files
# In nginx config: location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$
```

#### 3. **Database Connection Failed**
```bash
# Test connection
php artisan tinker
>>> DB::connection()->getPdo();

# Check credentials in .env
cat .env | grep DB_

# Check MySQL is running
sudo systemctl status mysql
```

#### 4. **Cache Issues**
```bash
# Clear ALL caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
redis-cli FLUSHALL  # If using Redis
```

#### 5. **Queue Not Processing**
```bash
# Check queue workers
sudo supervisorctl status

# Restart queue workers
php artisan queue:restart
sudo supervisorctl restart gympro-worker:*

# Check queue jobs
php artisan queue:work --once
```

---

## 📞 EMERGENCY CONTACTS

**Before deployment, ensure you have:**
- [ ] Database admin contact
- [ ] Server admin contact
- [ ] PhonePe support contact
- [ ] Email service support
- [ ] Backup admin access

---

## ✅ DEPLOYMENT COMPLETE CHECKLIST

### Final Verification

- [ ] Application is online
- [ ] No errors in logs
- [ ] Admin can login
- [ ] Members can login
- [ ] Dashboard loads correctly
- [ ] All pages accessible
- [ ] Payment gateway working
- [ ] Reports generating
- [ ] Email notifications working
- [ ] Performance is good (< 2s page load)
- [ ] Mobile responsive working
- [ ] Dark mode working
- [ ] No console errors
- [ ] SSL certificate valid
- [ ] Backups are safe

---

## 📈 POST-DEPLOYMENT MONITORING

### Week 1 Monitoring

**Daily checks:**
- Error logs
- Performance metrics
- User feedback
- Payment success rate
- Database size
- Disk space
- Memory usage

**Weekly checks:**
- Security updates
- Backup verification
- Performance optimization
- User analytics

---

## 🎯 QUICK DEPLOYMENT SCRIPT

Save this as `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Maintenance mode
php artisan down --refresh=15

# Pull code
git pull origin main

# Dependencies
composer install --optimize-autoloader --no-dev
npm ci --production

# Migrations
php artisan migrate --force

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build assets
npm run build

# Permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Restart services
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
php artisan queue:restart

# Bring back online
php artisan up

echo "✅ Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

---

## 🎉 DEPLOYMENT SUCCESS!

**Congratulations! Your application is now live in production.**

**Next Steps:**
1. Monitor logs for 24 hours
2. Test all critical features
3. Inform users of any changes
4. Document any issues
5. Plan next deployment

---

**Document Version**: 1.0  
**Last Updated**: January 2024  
**Status**: Production Ready ✅
