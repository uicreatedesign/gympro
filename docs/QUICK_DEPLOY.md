# 🚀 QUICK DEPLOYMENT REFERENCE

## ⚡ FASTEST DEPLOYMENT (Copy & Paste)

```bash
# 1. BACKUP FIRST!
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. MAINTENANCE MODE
php artisan down --refresh=15

# 3. PULL CODE
git pull origin main

# 4. UPDATE DEPENDENCIES
composer install --optimize-autoloader --no-dev
npm ci --production

# 5. RUN MIGRATIONS
php artisan migrate --force

# 6. CLEAR & CACHE
php artisan cache:clear && php artisan config:clear && php artisan route:clear && php artisan view:clear
php artisan config:cache && php artisan route:cache && php artisan view:cache

# 7. BUILD ASSETS
npm run build

# 8. PERMISSIONS
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# 9. RESTART SERVICES
sudo systemctl restart php8.2-fpm nginx
php artisan queue:restart

# 10. BRING ONLINE
php artisan up
```

---

## 🔥 EMERGENCY ROLLBACK

```bash
php artisan down
mysql -u username -p database_name < backup_YYYYMMDD_HHMMSS.sql
git reset --hard HEAD~1
composer install --no-dev
npm ci --production
npm run build
php artisan cache:clear && php artisan config:clear
php artisan up
```

---

## 📋 CRITICAL CHECKS BEFORE DEPLOYMENT

```bash
# Local testing
php artisan test
vendor/bin/pint
npm run lint

# Environment check
cat .env | grep APP_ENV    # Should be: production
cat .env | grep APP_DEBUG  # Should be: false
cat .env | grep PHONEPE_ENV # Should be: PRODUCTION
```

---

## 🔍 POST-DEPLOYMENT VERIFICATION

```bash
# Check application
php artisan about

# Check logs
tail -f storage/logs/laravel.log

# Test database
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit

# Test cache
php artisan tinker
>>> Cache::put('test', 'value', 60);
>>> Cache::get('test');
>>> exit
```

---

## 🎯 ONE-LINE DEPLOYMENT (Use with Caution!)

```bash
php artisan down && git pull origin main && composer install --no-dev && npm ci --production && php artisan migrate --force && php artisan cache:clear && php artisan config:cache && php artisan route:cache && php artisan view:cache && npm run build && sudo systemctl restart php8.2-fpm nginx && php artisan queue:restart && php artisan up
```

---

## 📞 EMERGENCY COMMANDS

```bash
# Check what's wrong
php artisan about
tail -f storage/logs/laravel.log
sudo tail -f /var/log/nginx/error.log

# Fix permissions
sudo chown -R www-data:www-data /var/www/gympro
sudo chmod -R 775 storage bootstrap/cache

# Clear everything
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
redis-cli FLUSHALL

# Restart everything
sudo systemctl restart php8.2-fpm nginx mysql redis
php artisan queue:restart
```

---

## ✅ MUST TEST AFTER DEPLOYMENT

1. ✅ Admin login
2. ✅ Member login
3. ✅ Dashboard loads
4. ✅ Create member
5. ✅ Create subscription
6. ✅ Mark attendance
7. ✅ Generate report
8. ✅ PhonePe payment (test mode first!)

---

## 🔐 PRODUCTION .env ESSENTIALS

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_DATABASE=gympro_production
DB_USERNAME=gympro_user
DB_PASSWORD=strong_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

PHONEPE_ENV=PRODUCTION
PHONEPE_MERCHANT_ID=prod_merchant_id
PHONEPE_SALT_KEY=prod_salt_key

SESSION_SECURE_COOKIE=true
```

---

## 📊 MONITORING COMMANDS

```bash
# Watch logs live
tail -f storage/logs/laravel.log

# Check system resources
htop

# Check disk space
df -h

# Check memory
free -m

# Check queue jobs
php artisan queue:work --once

# Check cache stats (Redis)
redis-cli info stats
```

---

## 🎉 DEPLOYMENT CHECKLIST

**Before:**
- [ ] Backup database
- [ ] Backup files
- [ ] Test locally
- [ ] Review migrations
- [ ] Update .env for production

**During:**
- [ ] Maintenance mode ON
- [ ] Pull code
- [ ] Update dependencies
- [ ] Run migrations
- [ ] Build assets
- [ ] Restart services
- [ ] Maintenance mode OFF

**After:**
- [ ] Test login
- [ ] Test core features
- [ ] Check logs
- [ ] Monitor performance
- [ ] Verify payments work

---

**⚠️ REMEMBER:**
1. Always backup first
2. Test in staging if possible
3. Deploy during low-traffic hours
4. Monitor for 24 hours after deployment
5. Have rollback plan ready

---

**Need help?** Check `PRODUCTION_DEPLOYMENT.md` for detailed guide.
