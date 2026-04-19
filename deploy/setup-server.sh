#!/bin/bash
set -e

echo "=========================================="
echo "  Eduwave VPS Deployment Script"
echo "=========================================="

# Step 1: System Update
echo ""
echo ">>> Step 1: Updating system..."
apt update && apt upgrade -y

# Step 2: Install Node.js 20
echo ""
echo ">>> Step 2: Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v

# Step 3: Install MySQL 8
echo ""
echo ">>> Step 3: Installing MySQL..."
apt install -y mysql-server
systemctl enable mysql
systemctl start mysql

# Step 4: Install Nginx
echo ""
echo ">>> Step 4: Installing Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# Step 5: Install additional tools
echo ""
echo ">>> Step 5: Installing tools..."
apt install -y git build-essential certbot python3-certbot-nginx unzip

# Step 6: Install PM2
echo ""
echo ">>> Step 6: Installing PM2..."
npm install -g pm2

# Step 7: Configure MySQL
echo ""
echo ">>> Step 7: Configuring MySQL..."
mysql -e "CREATE DATABASE IF NOT EXISTS eduwave CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS 'eduwave_user'@'localhost' IDENTIFIED BY 'EduW@ve_DB_2026';"
mysql -e "GRANT ALL PRIVILEGES ON eduwave.* TO 'eduwave_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"
echo "MySQL database 'eduwave' created with user 'eduwave_user'"

# Step 8: Create app directory
echo ""
echo ">>> Step 8: Creating app directory..."
mkdir -p /var/www/eduwave

echo ""
echo "=========================================="
echo "  Base setup complete!"
echo "  Next: Upload the project files"
echo "=========================================="
